//package com.example.demo.menu.service;
//
//import com.example.demo.menu.exception.MenuException;
//import com.example.demo.menu.model.Menu;
//import com.example.demo.menu.model.MenuCategory;
//import com.example.demo.menu.model.MenuItem;
//import com.example.demo.menu.repository.MenuRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//@AllArgsConstructor
//public class MenuServiceImpl implements MenuService {
//
//    private final MenuRepository menuRepository;
//
//    @Override
//    public void addCategory(String restaurantId, MenuCategory category) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        if (menu.getCategories() == null) {
//            menu.setCategories(new ArrayList<>());
//        }
//
//        boolean exists = menu.getCategories().stream()
//                .anyMatch(c -> c.getCategoryType() == category.getCategoryType());
//
//        if (exists) {
//            throw new MenuException("Category already exists");
//        }
//
//        category.setCategoryId(UUID.randomUUID().toString());
//        category.setItems(new ArrayList<>());
//
//        menu.getCategories().add(category);
//        menuRepository.save(menu);
//    }
//
//    @Override
//    public void deleteCategory(String restaurantId, String categoryId) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        boolean removed = menu.getCategories()
//                .removeIf(c -> c.getCategoryId().equals(categoryId));
//
//        if (!removed) {
//            throw new MenuException("Category not found");
//        }
//
//        menuRepository.save(menu);
//    }
//
//    @Override
//    public void addItem(String restaurantId, String categoryId, MenuItem item) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        MenuCategory category = menu.getCategories().stream()
//                .filter(c -> c.getCategoryId().equals(categoryId))
//                .findFirst()
//                .orElseThrow(() -> new MenuException("Category not found"));
//
//        if (category.getItems() == null) {
//            category.setItems(new ArrayList<>());
//        }
//
//        item.setItemId(UUID.randomUUID().toString());
//        item.setAverageRating(0.0);
//        item.setTotalRatings(0);
//
//        category.getItems().add(item);
//        menuRepository.save(menu);
//    }
//
//    @Override
//    public void updateItem(String restaurantId, String categoryId, MenuItem item) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        MenuCategory category = menu.getCategories().stream()
//                .filter(c -> c.getCategoryId().equals(categoryId))
//                .findFirst()
//                .orElseThrow(() -> new MenuException("Category not found"));
//
//        MenuItem existing = category.getItems().stream()
//                .filter(i -> i.getItemId().equals(item.getItemId()))
//                .findFirst()
//                .orElseThrow(() -> new MenuException("Item not found"));
//
//        existing.setItemName(item.getItemName());
//        existing.setPrice(item.getPrice());
//        existing.setVeg(item.isVeg());
//        existing.setAvailable(item.isAvailable());
//        existing.setDescription(item.getDescription());
//        existing.setImageUrl(item.getImageUrl());
//
//        menuRepository.save(menu);
//    }
//
//    @Override
//    public void deleteItem(String restaurantId, String categoryId, String itemId) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        MenuCategory category = menu.getCategories().stream()
//                .filter(c -> c.getCategoryId().equals(categoryId))
//                .findFirst()
//                .orElseThrow(() -> new MenuException("Category not found"));
//
//        boolean removed = category.getItems()
//                .removeIf(i -> i.getItemId().equals(itemId));
//
//        if (!removed) {
//            throw new MenuException("Item not found");
//        }
//
//        menuRepository.save(menu);
//    }
//
//    @Override
//    public List<MenuCategory> getMenu(String restaurantId) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        return menu.getCategories();
//    }
//
//    @Override
//    public List<MenuCategory> getMenu(
//            String restaurantId,
//            String category,
//            Boolean veg,
//            String sortBy,
//            String order
//    ) {
//
//        Menu menu = menuRepository.findByRestaurantId(restaurantId)
//                .orElseThrow(() -> new MenuException("Menu not found"));
//
//        List<MenuCategory> categories = new ArrayList<>(menu.getCategories());
//
//        if (category != null && !category.isBlank()) {
//            categories = categories.stream()
//                    .filter(c -> c.getCategoryType().name().equalsIgnoreCase(category))
//                    .collect(Collectors.toList());
//        }
//
//        if (veg != null) {
//            for (MenuCategory c : categories) {
//                if (c.getItems() != null) {
//                    c.setItems(
//                            c.getItems().stream()
//                                    .filter(i -> i.isVeg() == veg)
//                                    .collect(Collectors.toList())
//                    );
//                }
//            }
//        }
//
//        if ("price".equalsIgnoreCase(sortBy)) {
//            for (MenuCategory c : categories) {
//                if (c.getItems() != null) {
//                    if ("desc".equalsIgnoreCase(order)) {
//                        c.getItems().sort((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
//                    } else {
//                        c.getItems().sort((a, b) -> Double.compare(a.getPrice(), b.getPrice()));
//                    }
//                }
//            }
//        }
//
//        categories = categories.stream()
//                .filter(c -> c.getItems() != null && !c.getItems().isEmpty())
//                .collect(Collectors.toList());
//
//        return categories;
//    }
//}
package com.example.demo.menu.service;

import com.example.demo.aws.service.S3Service;
import com.example.demo.menu.dto.AddMenuItemRequest;
import com.example.demo.menu.dto.UpdateMenuItemRequest;
import com.example.demo.menu.exception.MenuException;
import com.example.demo.menu.model.Menu;
import com.example.demo.menu.model.MenuCategory;
import com.example.demo.menu.model.MenuItem;
import com.example.demo.menu.repository.MenuRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;

    private final S3Service s3Service;
    // ================= CATEGORY =================

    @Override
    public void addCategory(String restaurantId, MenuCategory category) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        if (menu.getCategories() == null) {
            menu.setCategories(new ArrayList<>());
        }

        boolean exists = menu.getCategories().stream()
                .anyMatch(c ->
                        c.getCategoryType().name()
                                .equalsIgnoreCase(category.getCategoryType().name())
                );

        if (exists) {
            throw new MenuException("Category already exists");
        }

        category.setCategoryId(UUID.randomUUID().toString());
        category.setItems(new ArrayList<>());

        menu.getCategories().add(category);
        menuRepository.save(menu);
    }

    @Override
    public void deleteCategory(String restaurantId, String categoryId) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        boolean removed = menu.getCategories()
                .removeIf(c -> c.getCategoryId().equals(categoryId));

        if (!removed) {
            throw new MenuException("Category not found");
        }

        menuRepository.save(menu);
    }

    @Override
    public List<MenuCategory> getCategories(String restaurantId) {
        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));
        return menu.getCategories();
    }

    // ================= ITEM =================

    @Override
    public void addItem(
            String restaurantId,
            String categoryId,
            String itemName,
            double price,
            boolean veg,
            String description,
            MultipartFile image
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        MenuCategory category = menu.getCategories().stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new MenuException("Category not found"));

        if (category.getItems() == null) {
            category.setItems(new ArrayList<>());
        }

        // 🔥 UPLOAD IMAGE TO S3 (same as restaurant)
        String imageUrl = s3Service.uploadImage(image);

        MenuItem item = new MenuItem();
        item.setItemId(UUID.randomUUID().toString());
        item.setItemName(itemName);
        item.setPrice(price);
        item.setVeg(veg);
        item.setAvailable(true);
        item.setDescription(description);
        item.setImageUrl(imageUrl); // ✅ S3 URL
        item.setAverageRating(0.0);
        item.setTotalRatings(0);

        category.getItems().add(item);
        menuRepository.save(menu);
    }

    @Override
    public void updateItem(
            String restaurantId,
            String categoryId,
            UpdateMenuItemRequest request
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        MenuCategory category = menu.getCategories().stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new MenuException("Category not found"));

        MenuItem item = category.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElseThrow(() -> new MenuException("Item not found"));

        item.setItemName(request.getItemName());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        item.setDescription(request.getDescription());

        menuRepository.save(menu);
    }

    @Override
    public void deleteItem(
            String restaurantId,
            String categoryId,
            String itemId
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        MenuCategory category = menu.getCategories().stream()
                .filter(c -> c.getCategoryId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new MenuException("Category not found"));

        boolean removed = category.getItems()
                .removeIf(i -> i.getItemId().equals(itemId));

        if (!removed) {
            throw new MenuException("Item not found");
        }

        menuRepository.save(menu);
    }

    @Override
    public MenuItem getItem(String restaurantId, String itemId) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        return menu.getCategories().stream()
                .flatMap(c -> c.getItems().stream())
                .filter(i -> i.getItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new MenuException("Item not found"));
    }

    @Override
    public void updateAvailability(
            String restaurantId,
            String itemId,
            boolean available
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        boolean updated = false;

        for (MenuCategory category : menu.getCategories()) {
            for (MenuItem item : category.getItems()) {
                if (item.getItemId().equals(itemId)) {
                    item.setAvailable(available);
                    updated = true;
                    break;
                }
            }
        }

        if (!updated) {
            throw new MenuException("Item not found");
        }

        menuRepository.save(menu);
    }

    // ================= MENU VIEW =================

    @Override
    public List<MenuCategory> getMenu(
            String restaurantId,
            String category,
            Boolean veg,
            String sortBy,
            String order
    ) {

        Menu menu = menuRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new MenuException("Menu not found"));

        List<MenuCategory> categories = new ArrayList<>(menu.getCategories());

        if (category != null && !category.isBlank()) {
            categories = categories.stream()
                    .filter(c ->
                            c.getCategoryType().name()
                                    .equalsIgnoreCase(category)
                    )
                    .collect(Collectors.toList());
        }

        if (veg != null) {
            for (MenuCategory c : categories) {
                c.setItems(
                        c.getItems().stream()
                                .filter(i -> i.isVeg() == veg)
                                .collect(Collectors.toList())
                );
            }
        }

        if ("price".equalsIgnoreCase(sortBy)) {
            for (MenuCategory c : categories) {
                c.getItems().sort(
                        "desc".equalsIgnoreCase(order)
                                ? (a, b) -> Double.compare(b.getPrice(), a.getPrice())
                                : (a, b) -> Double.compare(a.getPrice(), b.getPrice())
                );
            }
        }

        return categories.stream()
                .filter(c -> !c.getItems().isEmpty())
                .collect(Collectors.toList());
    }
}
