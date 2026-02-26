package com.example.demo.menu.repository;

import com.example.demo.menu.model.MenuItemReview;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemReviewRepository
        extends MongoRepository<MenuItemReview, String> {

    // Optional (future use)
    List<MenuItemReview> findByItemId(String itemId);
    // ✅ ADD THIS METHOD (FIX)
    List<MenuItemReview> findByItemIdIn(List<String> itemIds);
    Optional<MenuItemReview> findByItemIdAndUserId(
            String itemId,
            String userId
    );
    List<MenuItemReview> findByRestaurantId(String restaurantId);
    List<MenuItemReview> findByRestaurantIdAndItemId(
            String restaurantId,
            String itemId
    );

//    @Query("""
//SELECT r FROM MenuItemReview r
//WHERE r.restaurantId IN :restaurantIds
//""")
//    List<MenuItemReview> findByRestaurantIds(@Param("restaurantIds") List<String> restaurantIds);

}
