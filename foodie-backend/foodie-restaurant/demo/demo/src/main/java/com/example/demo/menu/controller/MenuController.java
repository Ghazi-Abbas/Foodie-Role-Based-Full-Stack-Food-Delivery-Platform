//package com.example.demo.menu.controller;
//
//import com.example.demo.menu.model.MenuCategory;
//import com.example.demo.menu.model.MenuItem;
//import com.example.demo.menu.service.MenuService;
//import lombok.AllArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/restaurants/{restaurantId}/menu")
//@CrossOrigin("*")
//@AllArgsConstructor
//public class MenuController {
//
//    private final MenuService menuService;
//
//    // =====================================================
//    // 1️⃣ ADD CATEGORY
//    // POST /restaurants/{restaurantId}/menu/categories
//    // =====================================================
//    @PostMapping("/categories")
//    public ResponseEntity<String> addCategory(
//            @PathVariable String restaurantId,
//            @RequestBody MenuCategory category) {
//
//        menuService.addCategory(restaurantId, category);
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body("Category added successfully");
//    }
//
//    // =====================================================
//    // 2️⃣ DELETE CATEGORY
//    // DELETE /restaurants/{restaurantId}/menu/categories/{categoryId}
//    // =====================================================
//    @DeleteMapping("/categories/{categoryId}")
//    public ResponseEntity<String> deleteCategory(
//            @PathVariable String restaurantId,
//            @PathVariable String categoryId) {
//
//        menuService.deleteCategory(restaurantId, categoryId);
//        return ResponseEntity.ok("Category deleted successfully");
//    }
//
//    // =====================================================
//    // 3️⃣ ADD ITEM TO CATEGORY
//    // POST /restaurants/{restaurantId}/menu/categories/{categoryId}/items
//    // =====================================================
//    @PostMapping("/categories/{categoryId}/items")
//    public ResponseEntity<String> addItem(
//            @PathVariable String restaurantId,
//            @PathVariable String categoryId,
//            @RequestBody MenuItem item) {
//
//        menuService.addItem(restaurantId, categoryId, item);
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body("Item added successfully");
//    }
//
//    // =====================================================
//    // 4️⃣ UPDATE ITEM
//    // PUT /restaurants/{restaurantId}/menu/categories/{categoryId}/items
//    // =====================================================
//    @PutMapping("/categories/{categoryId}/items")
//    public ResponseEntity<String> updateItem(
//            @PathVariable String restaurantId,
//            @PathVariable String categoryId,
//            @RequestBody MenuItem item) {
//
//        menuService.updateItem(restaurantId, categoryId, item);
//        return ResponseEntity.ok("Item updated successfully");
//    }
//
//    // =====================================================
//    // 5️⃣ DELETE ITEM
//    // DELETE /restaurants/{restaurantId}/menu/categories/{categoryId}/items/{itemId}
//    // =====================================================
//    @DeleteMapping("/categories/{categoryId}/items/{itemId}")
//    public ResponseEntity<String> deleteItem(
//            @PathVariable String restaurantId,
//            @PathVariable String categoryId,
//            @PathVariable String itemId) {
//
//        menuService.deleteItem(restaurantId, categoryId, itemId);
//        return ResponseEntity.ok("Item deleted successfully");
//    }
//
//    // =====================================================
//    // 6️⃣ GET MENU (FILTER + SORT)
//    // GET /restaurants/{restaurantId}/menu
//    // =====================================================
//    @GetMapping
//    public ResponseEntity<?> getMenu(
//            @PathVariable String restaurantId,
//            @RequestParam(required = false) String category, // VEG, SNACKS, etc
//            @RequestParam(required = false) Boolean veg,
//            @RequestParam(required = false) String sortBy,
//            @RequestParam(defaultValue = "asc") String order
//    ) {
//        return ResponseEntity.ok(
//                menuService.getMenu(restaurantId, category, veg, sortBy, order)
//        );
//    }
//}
package com.example.demo.menu.controller;

import com.example.demo.menu.dto.AddMenuItemRequest;
import com.example.demo.menu.dto.AvailabilityRequest;
import com.example.demo.menu.dto.UpdateMenuItemRequest;
import com.example.demo.menu.model.MenuCategory;
import com.example.demo.menu.service.MenuService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/restaurants/{restaurantId}/menu")
@CrossOrigin("*")
@AllArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // ================= CATEGORY =================

    // 1️⃣ ADD CATEGORY
    @PostMapping("/categories")
    public ResponseEntity<String> addCategory(
            @PathVariable String restaurantId,
            @RequestBody MenuCategory category) {

        menuService.addCategory(restaurantId, category);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Category added successfully");
    }

    // 2️⃣ DELETE CATEGORY
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String restaurantId,
            @PathVariable String categoryId) {

        menuService.deleteCategory(restaurantId, categoryId);
        return ResponseEntity.ok("Category deleted successfully");
    }

    // 3️⃣ GET ALL CATEGORIES (SELLER UI NEEDS THIS)
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                menuService.getCategories(restaurantId)
        );
    }

    // ================= ITEM =================

    // 4️⃣ ADD ITEM
    @PostMapping(
            value = "/categories/{categoryId}/items",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> addItem(
            @PathVariable String restaurantId,
            @PathVariable String categoryId,

            @RequestParam String itemName,
            @RequestParam double price,
            @RequestParam boolean veg,
            @RequestParam String description,
            @RequestParam MultipartFile image
    ) {

        menuService.addItem(
                restaurantId,
                categoryId,
                itemName,
                price,
                veg,
                description,
                image
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Item added successfully");
    }

    // 5️⃣ UPDATE ITEM
    @PutMapping("/categories/{categoryId}/items")
    public ResponseEntity<String> updateItem(
            @PathVariable String restaurantId,
            @PathVariable String categoryId,
            @RequestBody UpdateMenuItemRequest request) {

        menuService.updateItem(restaurantId, categoryId, request);
        return ResponseEntity.ok("Item updated successfully");
    }

    // 6️⃣ DELETE ITEM
    @DeleteMapping("/categories/{categoryId}/items/{itemId}")
    public ResponseEntity<String> deleteItem(
            @PathVariable String restaurantId,
            @PathVariable String categoryId,
            @PathVariable String itemId) {

        menuService.deleteItem(restaurantId, categoryId, itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }

    // 7️⃣ GET SINGLE ITEM (EDIT SCREEN)
    @GetMapping("/items/{itemId}")
    public ResponseEntity<?> getItem(
            @PathVariable String restaurantId,
            @PathVariable String itemId) {

        return ResponseEntity.ok(
                menuService.getItem(restaurantId, itemId)
        );
    }

    // 8️⃣ TOGGLE AVAILABILITY (PATCH)
    @PatchMapping("/items/{itemId}/availability")
    public ResponseEntity<String> updateAvailability(
            @PathVariable String restaurantId,
            @PathVariable String itemId,
            @RequestBody AvailabilityRequest request) {

        menuService.updateAvailability(
                restaurantId,
                itemId,
                request.isAvailable()
        );

        return ResponseEntity.ok("Availability updated");
    }

    // ================= MENU VIEW =================

    // 9️⃣ GET MENU (FILTER + SORT)
    @GetMapping
    public ResponseEntity<?> getMenu(
            @PathVariable String restaurantId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean veg,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        return ResponseEntity.ok(
                menuService.getMenu(
                        restaurantId,
                        category,
                        veg,
                        sortBy,
                        order
                )
        );
    }
}
