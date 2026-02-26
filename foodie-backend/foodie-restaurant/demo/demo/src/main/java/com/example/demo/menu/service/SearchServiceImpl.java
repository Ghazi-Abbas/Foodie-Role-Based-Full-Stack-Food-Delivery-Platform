package com.example.demo.menu.service;

import com.example.demo.menu.dto.SearchItemDTO;
import com.example.demo.menu.model.Menu;
import com.example.demo.menu.model.MenuItem;
import com.example.demo.menu.model.MenuItemReview;
import com.example.demo.restaurant.model.Restaurant;
import com.example.demo.menu.repository.MenuItemReviewRepository;
import com.example.demo.menu.repository.MenuRepository;
import com.example.demo.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final MenuRepository menuRepository;
    private final MenuItemReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    private static final int HARD_LIMIT = 300;               // 🔥 protect JVM
    private static final int MAX_ITEMS_PER_RESTAURANT = 5;  // 🔄 rotation

    @Override
    public List<SearchItemDTO> search(
            String query,
            Boolean veg,
            String category,
            Double minRating,
            String sort,
            String order,
            int page,
            int size
    ) {

        String safeQuery = query == null ? "" : query.toLowerCase();

        // 🔥 Load maps ONCE
        Map<String, String> restaurantNameMap = loadRestaurantNames();
        Map<String, Double> ratingMap = loadRatings();

        List<SearchItemDTO> results = new ArrayList<>();
        Map<String, Integer> restaurantCount = new HashMap<>();

        // 🔄 SHUFFLE MENUS → restaurant rotation
        List<Menu> menus = new ArrayList<>(menuRepository.findAll());
        Collections.shuffle(menus);

        // ⚡ FAST LOOP WITH ROTATION + HARD STOP
        outer:
        for (Menu menu : menus) {

            String restaurantId = menu.getRestaurantId();
            int used = restaurantCount.getOrDefault(restaurantId, 0);

            if (used >= MAX_ITEMS_PER_RESTAURANT) continue;

            for (var cat : menu.getCategories()) {

                if (category != null &&
                        !cat.getCategoryType().name().equalsIgnoreCase(category)) {
                    continue;
                }

                for (MenuItem item : cat.getItems()) {

                    if (!item.getItemName().toLowerCase().contains(safeQuery))
                        continue;

                    if (veg != null && item.isVeg() != veg)
                        continue;

                    SearchItemDTO dto = toDTO(
                            menu,
                            item,
                            restaurantNameMap,
                            ratingMap
                    );

                    if (minRating != null && dto.getRating() < minRating)
                        continue;

                    results.add(dto);
                    restaurantCount.put(restaurantId, used + 1);
                    used++;

                    // 🔥 PER-RESTAURANT CAP
                    if (used >= MAX_ITEMS_PER_RESTAURANT) break;

                    // 🔥 GLOBAL HARD STOP
                    if (results.size() >= HARD_LIMIT) {
                        break outer;
                    }
                }
            }
        }

        // 🔁 fallback ONLY if empty
        if (results.isEmpty()) {
            results = getRecommendedItems(
                    veg,
                    minRating,
                    restaurantNameMap,
                    ratingMap
            );
        }

        // 🔃 sorting
        results = applySorting(results, sort, order);

        // 📄 pagination
        int from = Math.min(page * size, results.size());
        int to = Math.min(from + size, results.size());

        return results.subList(from, to);
    }

    // ================= RECOMMENDATIONS =================

    private List<SearchItemDTO> getRecommendedItems(
            Boolean veg,
            Double minRating,
            Map<String, String> restaurantNameMap,
            Map<String, Double> ratingMap
    ) {

        List<SearchItemDTO> list = new ArrayList<>();
        Map<String, Integer> restaurantCount = new HashMap<>();

        for (Menu menu : menuRepository.findAll()) {

            String restaurantId = menu.getRestaurantId();
            int used = restaurantCount.getOrDefault(restaurantId, 0);

            if (used >= 3) continue;

            for (var cat : menu.getCategories()) {
                for (MenuItem item : cat.getItems()) {

                    if (veg != null && item.isVeg() != veg)
                        continue;

                    SearchItemDTO dto = toDTO(
                            menu,
                            item,
                            restaurantNameMap,
                            ratingMap
                    );

                    if (minRating != null && dto.getRating() < minRating)
                        continue;

                    list.add(dto);
                    restaurantCount.put(restaurantId, used + 1);
                    used++;

                    if (list.size() >= 30) return list;
                    if (used >= 3) break;
                }
            }
        }
        return list;
    }

    // ================= SORTING =================

    private List<SearchItemDTO> applySorting(
            List<SearchItemDTO> list,
            String sort,
            String order
    ) {
        if (sort == null) return list;

        Comparator<SearchItemDTO> comparator =
                "price".equalsIgnoreCase(sort)
                        ? Comparator.comparing(SearchItemDTO::getPrice)
                        : Comparator.comparing(SearchItemDTO::getRating);

        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        return list.stream().sorted(comparator).toList();
    }

    // ================= DTO =================

    private SearchItemDTO toDTO(
            Menu menu,
            MenuItem item,
            Map<String, String> restaurantNameMap,
            Map<String, Double> ratingMap
    ) {

        String key = menu.getRestaurantId() + "_" + item.getItemId();
        double rating = ratingMap.getOrDefault(key, 0.0);

        String restaurantName =
                restaurantNameMap.getOrDefault(
                        menu.getRestaurantId(),
                        "Restaurant"
                );

        return new SearchItemDTO(
                item.getItemId(),
                item.getItemName(),
                item.getPrice(),
                item.isVeg(),
                item.getImageUrl(),
                rating,
                menu.getRestaurantId(),
                restaurantName
        );
    }

    // ================= LOADERS =================

    private Map<String, String> loadRestaurantNames() {
        return restaurantRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        Restaurant::getId,
                        Restaurant::getRestaurantName
                ));
    }

    private Map<String, Double> loadRatings() {
        return reviewRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        r -> r.getRestaurantId() + "_" + r.getItemId(),
                        Collectors.averagingDouble(MenuItemReview::getRating)
                ))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> Math.round(e.getValue() * 10.0) / 10.0
                ));
    }
}
