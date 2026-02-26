//package com.example.demo.menu.service;
//
//import com.example.demo.menu.model.MenuCategory;
//import com.example.demo.menu.model.MenuItem;
//
//import java.util.List;
//
//public interface MenuService {
//
//    void addCategory(String restaurantId, MenuCategory category);
//
//    void deleteCategory(String restaurantId, String categoryId);
//
//    void addItem(String restaurantId, String categoryId, MenuItem item);
//
//    void updateItem(String restaurantId, String categoryId, MenuItem item);
//
//    void deleteItem(String restaurantId, String categoryId, String itemId);
//
//    List<MenuCategory> getMenu(String restaurantId);
//
//    List<MenuCategory> getMenu(
//            String restaurantId,
//            String category,
//            Boolean veg,
//            String sortBy,
//            String order
//    );
//}
package com.example.demo.menu.service;

import com.example.demo.menu.dto.AddMenuItemRequest;
import com.example.demo.menu.dto.UpdateMenuItemRequest;
import com.example.demo.menu.model.MenuCategory;
import com.example.demo.menu.model.MenuItem;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuService {

    // ===== CATEGORY =====

    void addCategory(String restaurantId, MenuCategory category);

    void deleteCategory(String restaurantId, String categoryId);

    List<MenuCategory> getCategories(String restaurantId);


    // ===== ITEM =====


    // 🔥 UPDATED — Multipart image upload
    void addItem(
            String restaurantId,
            String categoryId,
            String itemName,
            double price,
            boolean veg,
            String description,
            MultipartFile image
    );


    void updateItem(
            String restaurantId,
            String categoryId,
            UpdateMenuItemRequest request
    );

    void deleteItem(
            String restaurantId,
            String categoryId,
            String itemId
    );

    MenuItem getItem(
            String restaurantId,
            String itemId
    );

    void updateAvailability(
            String restaurantId,
            String itemId,
            boolean available
    );


    // ===== MENU VIEW =====

    List<MenuCategory> getMenu(
            String restaurantId,
            String category,
            Boolean veg,
            String sortBy,
            String order
    );
}
