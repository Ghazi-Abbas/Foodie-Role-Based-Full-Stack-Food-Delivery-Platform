//package com.example.demo.menu.seed;
//
//import com.example.demo.menu.model.Menu;
//import com.example.demo.menu.model.MenuCategory;
//import com.example.demo.menu.model.MenuItem;
//import com.example.demo.menu.model.MenuItemReview;
//import com.example.demo.menu.repository.MenuRepository;
//import com.example.demo.menu.repository.MenuItemReviewRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Random;
//import java.util.UUID;
//
//@Configuration
//@RequiredArgsConstructor
//public class MenuItemReviewSeeder {
//
//    private final MenuRepository menuRepository;
//    private final MenuItemReviewRepository reviewRepository;
//
//    @Bean
//    CommandLineRunner seedItemReviews() {
//        return args -> {
//
//            // 🛑 SAFETY CHECK
//            if (reviewRepository.count() > 0) {
//                System.out.println("⚠️ Reviews already exist. Skipping seeding.");
//                return;
//            }
//
//            System.out.println("⭐ STARTING ITEM REVIEW SEEDING");
//
//            List<Menu> menus = menuRepository.findAll();
//            Random random = new Random();
//
//            for (Menu menu : menus) {
//
//                if (menu.getCategories() == null) continue;
//
//                for (MenuCategory category : menu.getCategories()) {
//
//                    if (category.getItems() == null) continue;
//
//                    for (MenuItem item : category.getItems()) {
//
//                        int reviewCount = 3 + random.nextInt(5); // 3–7 reviews
//
//                        for (int i = 0; i < reviewCount; i++) {
//
//                            int rating = generateRating(random);
//                            String reviewText = generateReviewText(rating);
//
//                            MenuItemReview review = new MenuItemReview();
//                            review.setId(UUID.randomUUID().toString());
//                            review.setRestaurantId(menu.getRestaurantId());
//                            review.setCategoryId(category.getCategoryId());
//                            review.setItemId(item.getItemId());
//
//                            review.setUserId("USER_" + random.nextInt(1000));
//                            review.setUserName(randomUserName(random));
//                            review.setRating(rating);
//                            review.setReview(reviewText);
//                            review.setCreatedAt(
//                                    LocalDateTime.now().minusDays(random.nextInt(30))
//                            );
//
//                            reviewRepository.save(review);
//                        }
//                    }
//                }
//            }
//
//            System.out.println("✅ ITEM REVIEWS SEEDED SUCCESSFULLY");
//        };
//    }
//
//    // ================= HELPERS =================
//
//    private int generateRating(Random random) {
//        int[] weighted = {2, 3, 3, 4, 4, 5, 5};
//        return weighted[random.nextInt(weighted.length)];
//    }
//
//    private String generateReviewText(int rating) {
//        return switch (rating) {
//            case 1 -> pick(
//                    "Very disappointing.",
//                    "Bad taste.",
//                    "Not fresh.",
//                    "Would not recommend."
//            );
//            case 2 -> pick(
//                    "Below average.",
//                    "Could be better.",
//                    "Not worth the price."
//            );
//            case 3 -> pick(
//                    "Average taste.",
//                    "Okay food.",
//                    "Nothing special."
//            );
//            case 4 -> pick(
//                    "Tasty and good.",
//                    "Really enjoyed it.",
//                    "Worth ordering again."
//            );
//            default -> pick(
//                    "Absolutely delicious!",
//                    "Amazing taste!",
//                    "Highly recommended!",
//                    "One of the best dishes!"
//            );
//        };
//    }
//
//    private String randomUserName(Random random) {
//        List<String> names = List.of(
//                "Rahul", "Amit", "Neha", "Priya", "Rohit",
//                "Ankit", "Suman", "Pooja", "Vikas", "Kiran",
//                "Arjun", "Sneha", "Nikhil", "Riya", "Manish"
//        );
//        return names.get(random.nextInt(names.size()));
//    }
//
//    private String pick(String... values) {
//        return values[new Random().nextInt(values.length)];
//    }
//}
