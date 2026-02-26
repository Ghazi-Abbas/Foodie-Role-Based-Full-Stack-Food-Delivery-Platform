//package com.example.demo.menu.seed;
//
//
//
//import com.example.demo.menu.model.*;
//import com.example.demo.menu.repository.MenuRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.*;
//
//@Configuration
//@RequiredArgsConstructor
//public class MenuCategoryImageSeeder {
//
//    private final MenuRepository menuRepository;
//
//    @Bean
//    CommandLineRunner seedMenusWithFixedImages() {
//        return args -> {
//
//            System.out.println("🚀 STARTING MENU IMAGE SEEDER");
//
//            List<Menu> menus = menuRepository.findAll();
//            Random random = new Random();
//
//            // ================= VEG (20) =================
//            List<MenuItem> vegItems = List.of(
//                    item("Paneer Butter Masala", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/paneer_butter_masala.jpg"),
//                    item("Shahi Paneer", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/shahi_paneer.jpg"),
//                    item("Kadai Paneer", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/kadai_paneer.jpg"),
//                    item("Palak Paneer", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Palak-Paneer.jpg"),
//                    item("Veg Biryani", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/veg_biryani.jpg"),
//                    item("Veg Pulao", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Veg_Pulao.jpg"),
//                    item("Dal Makhani", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Dal_Makhani.jpg"),
//                    item("Dal Tadka", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Dal_Tadka.webp"),
//                    item("Mix Veg Curry", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Mix_Veg_Curry.jfif"),
//                    item("Aloo Gobi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Aloo_Gobi.webp"),
//                    item("Malai Kofta", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Malai_Kofta.jpg"),
//                    item("Chole Masala", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Chole_Masala.jfif"),
//                    item("Rajma Masala", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Rajma_Masala.jpg"),
//                    item("Veg Kolhapuri", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Veg+Kolhapuri.jpg"),
//                    item("Bhindi Masala", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Bhindi_Masala.jpg"),
//                    item("Matar Paneer", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Matar_Paneer.jpg"),
//                    item("Dum Aloo", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Dum_Aloo.jpg"),
//                    item("Veg Handi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Veg_Handi.jpg"),
//                    item("Navratan Korma", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Navratan+Korma.jpg"),
//                    item("Paneer Tikka", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Veg-Items/Paneer_Tikka.webp")
//            );
//
//            // ================= NON-VEG (20) =================
//            List<MenuItem> nonVegItems = List.of(
//                    item("Chicken Biryani", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Biryani.jpg"),
//                    item("Mutton Biryani", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Mutton_Biryani.jpg"),
//                    item("Butter Chicken", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Butter_Chicken.jpg"),
//                    item("Chicken Tikka Masala", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Tikka_Masala.jpg"),
//                    item("Chicken Curry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Curry.jpg"),
//                    item("Mutton Curry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Mutton_Curry.jpg"),
//                    item("Chicken Korma", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Korma.avif"),
//                    item("Chicken Handi", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Handi.webp"),
//                    item("Chicken Lollipop", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Lollipop.webp"),
//                    item("Chicken 65", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_65.jpg"),
//                    item("Tandoori Chicken", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Tandoori_Chicken.jpg"),
//                    item("Chicken Fry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Fry.jpg"),
//                    item("Fish Curry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Fish_Curry.jpg"),
//                    item("Fish Fry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Fish_Fry.jfif"),
//                    item("Prawn Masala", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Prawn_Masala.webp"),
//                    item("Egg Curry", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Egg_Curry.jpg"),
//                    item("Chicken Seekh Kebab", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Seekh_Kebab.webp"),
//                    item("Mutton Rogan Josh", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Mutton_Rogan_Josh.jfif"),
//                    item("Chicken Shawarma", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Shawarma.jfif"),
//                    item("Chicken Keema", false, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Nonveg-Items/Chicken_Keema.jpg")
//            );
//
//            // ================= SNACKS (20) =================
//            List<MenuItem> snackItems = List.of(
//                    item("Samosa", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Samosa.jpg"),
//                    item("Kachori", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Kachori.jfif"),
//                    item("Pani Puri", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Pani_Puri.jpg"),
//                    item("Bhel Puri", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/bhel-puri.jpg"),
//                    item("Sev Puri", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Sev_Puri.webp"),
//                    item("Aloo Tikki", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Aloo_Tikki.jpg"),
//                    item("Pav Bhaji", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Pav_Bhaji.jpg"),
//                    item("Vada Pav", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Vada_Pav.webp"),
//                    item("Dahi Vada", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Dahi_Vada.jpg"),
//                    item("Pakora", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Pakora.webp"),
//                    item("Onion Bhaji", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Onion_Bhaji.jpg"),
//                    item("Bread Pakora", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Bread_Pakora.jpg"),
//                    item("Chaat Papdi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Chaat_Papdi.jpg"),
//                    item("Momos (Veg)", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Momos+(Veg).jpg"),
//                    item("Chole Bhature", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Chole_Bhature.jfif"),
//                    item("Poori Sabzi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Poori_Sabzi.jfif"),
//                    item("Idli", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Idli.webp"),
//                    item("Dosa", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Dosa.webp"),
//                    item("Uttapam", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Uttapam.webp"),
//                    item("Poha", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Snacks/Poha.jfif")
//            );
//
//            // ================= BEVERAGES (20) =================
//            List<MenuItem> beverageItems = List.of(
//                    item("Cold Coffee", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Cold_Coffee.jpg"),
//                    item("Hot Coffee", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Hot_Coffee.webp"),
//                    item("Masala Chai", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Masala_Chai.webp"),
//                    item("Green Tea", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Green_Tea.webp"),
//                    item("Lemon Tea", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Lemon+Tea.webp"),
//                    item("Mango Shake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Mango_Shake.jpg"),
//                    item("Strawberry Shake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Strawberry_Shake.jpg"),
//                    item("Chocolate Shake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Chocolate_Shake.jpg"),
//                    item("Banana Shake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Banana_Shake.jpg"),
//                    item("Lassi (Sweet)", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Lassi+(Sweet).jpg"),
//                    item("Lassi (Salted)", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Lassi+(Salted).webp"),
//                    item("Badam Milk", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Badam_Milk.jpg"),
//                    item("Rose Milk", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Rose_Milk.jpg"),
//                    item("Fresh Lime Soda", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Fresh_Lime_Soda.jfif"),
//                    item("Coca Cola", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Coca_Cola.png"),
//                    item("Watermelon Juice", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Watermelon_Juice.jfif"),
//                    item("Pepsi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Pepsi.webp"),
//                    item("Orange Juice", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Orange_Juice.avif"),
//                    item("Pineapple Juice", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Pineapple_Juice.jpg"),
//                    item("Mineral Water", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Beverages/Mineral_Water.png")
//            );
//
//            // ================= DESSERT (20) =================
//            List<MenuItem> dessertItems = List.of(
//                    item("Gulab Jamun", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Gulab_Jamun.webp"),
//                    item("Rasgulla", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Rasgulla.jfif"),
//                    item("Rasmalai", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/rasmalai.jpg"),
//                    item("Kheer", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Kheer.jpg"),
//                    item("Gajar Ka Halwa", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Gajar_Halwa.jpg"),
//                    item("Ice Cream", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Ice_Cream.jpg"),
//                    item("Chocolate Brownie", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Chocolate_Brownie.webp"),
//                    item("Brownie with Ice Cream", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Brownie_with_Ice_Cream.jpg"),
//                    item("Shahi Tukda", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Shahi_Tukda.jpg"),
//                    item("Kulfi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Kulfi.webp"),
//                    item("Jalebi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Jalebi.webp"),
//                    item("Jalebi with Rabri", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Jalebi_with_Rabri.webp"),
//                    item("Fruit Custard", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Fruit_Custard.webp"),
//                    item("Carrot Cake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Carrot_Cake.webp"),
//                    item("Cheesecake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Cheesecake.jpg"),
//                    item("Lava Cake", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Lava_Cake.jpg"),
//                    item("Falooda", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Falooda.webp"),
//                    item("Malpua", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Malpua.webp"),
//                    item("Peda", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Peda.jpg"),
//                    item("Barfi", true, "https://foodie-app-images-ankit.s3.eu-north-1.amazonaws.com/items-images/Dessert/Barfi.jpg")
//            );
//
//            for (Menu menu : menus) {
//
//                if (menu.getCategories() != null && !menu.getCategories().isEmpty()) continue;
//
//                menu.setCategories(List.of(
//                        category(MenuCategoryType.VEG, vegItems, random),
//                        category(MenuCategoryType.NON_VEG, nonVegItems, random),
//                        category(MenuCategoryType.SNACKS, snackItems, random),
//                        category(MenuCategoryType.BEVERAGES, beverageItems, random),
//                        category(MenuCategoryType.DESSERTS, dessertItems, random)
//                ));
//
//                menuRepository.save(menu);
//                System.out.println("✅ Seeded menu for restaurantId: " + menu.getRestaurantId());
//            }
//
//            System.out.println("🎉 MENU IMAGE SEEDING DONE");
//        };
//    }
//
//    // ================= HELPERS =================
//
//    private MenuCategory category(MenuCategoryType type, List<MenuItem> items, Random r) {
//        MenuCategory c = new MenuCategory();
//        c.setCategoryId(UUID.randomUUID().toString());
//        c.setCategoryType(type);
//
//        List<MenuItem> cloned = new ArrayList<>();
//        for (MenuItem i : items) {
//            MenuItem item = new MenuItem();
//            item.setItemId(UUID.randomUUID().toString());
//            item.setItemName(i.getItemName());
//            item.setImageUrl(i.getImageUrl());
//            item.setVeg(i.isVeg());
//            item.setAvailable(true);
//            item.setPrice(80 + r.nextInt(300));
//            item.setDescription("Delicious " + i.getItemName());
//            item.setAverageRating(0.0);
//            item.setTotalRatings(0);
//            cloned.add(item);
//        }
//
//        c.setItems(cloned);
//        return c;
//    }
//
//    private MenuItem item(String name, boolean veg, String url) {
//        MenuItem i = new MenuItem();
//        i.setItemName(name);
//        i.setVeg(veg);
//        i.setImageUrl(url);
//        return i;
//    }
//}
