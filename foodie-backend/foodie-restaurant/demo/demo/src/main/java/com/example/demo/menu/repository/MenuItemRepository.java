package com.example.demo.menu.repository;

import com.example.demo.menu.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface MenuItemRepository
        extends MongoRepository<MenuItem, String> {

    Optional<MenuItem> findByItemIdAndRestaurantId(
            String itemId,
            String restaurantId
    );
}
