package com.example.demo.menu.repository;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GuestMenuAggregationRepository {

    private final MongoTemplate mongoTemplate;

    public GuestMenuAggregationRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Document> getMenuWithRatings(String restaurantId) {

        Aggregation aggregation = Aggregation.newAggregation(

                // 1️⃣ Match restaurant
                Aggregation.match(
                        Criteria.where("restaurantId").is(restaurantId)
                ),

                // 2️⃣ Unwind categories
                Aggregation.unwind("categories"),

                // 3️⃣ Unwind items
                Aggregation.unwind("categories.items"),

                // 4️⃣ Lookup reviews
                Aggregation.lookup(
                        "menu_item_reviews",
                        "categories.items.itemId",
                        "itemId",
                        "reviews"
                ),

                // 5️⃣ Unwind reviews (keep items with no reviews)
                Aggregation.unwind("reviews", true),

                // 6️⃣ Group by itemId
                Aggregation.group("categories.items.itemId")
                        .first("categories.items.itemId").as("itemId")
                        .first("categories.items.itemName").as("name")
                        .first("categories.items.price").as("price")
                        .first("categories.items.veg").as("veg")
                        .first("categories.categoryType").as("category")
                        .first("categories.items.imageUrl").as("imageUrl")

                        // ⭐ Average rating
                        .avg("reviews.rating").as("averageRating")

                        // ⭐ Total ratings
                        .count().as("totalRatings"),

                // 7️⃣ Handle null ratings
                Aggregation.project()
                        .and("itemId").as("itemId")
                        .and("name").as("name")
                        .and("price").as("price")
                        .and("veg").as("veg")
                        .and("category").as("category")
                        .and("imageUrl").as("imageUrl")
                        .and(
                                ConditionalOperators.ifNull("averageRating")
                                        .then(0)
                        ).as("averageRating")
                        .and(
                                ConditionalOperators.ifNull("totalRatings")
                                        .then(0)
                        ).as("totalRatings")
        );

        return mongoTemplate
                .aggregate(aggregation, "menus", Document.class)
                .getMappedResults();
    }
}
