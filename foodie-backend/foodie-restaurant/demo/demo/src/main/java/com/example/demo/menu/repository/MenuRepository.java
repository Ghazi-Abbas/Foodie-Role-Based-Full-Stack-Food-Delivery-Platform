package com.example.demo.menu.repository;

import com.example.demo.menu.model.Menu;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends MongoRepository<Menu, String> {

    Optional<Menu> findByRestaurantId(String restaurantId);

//    // 🔥 Mongo-style nested query (NO JOIN)
//    @Query("{ 'items.itemName': { $regex: ?0, $options: 'i' } }")
//    List<Menu> searchMenusByItemName(String keyword);
}