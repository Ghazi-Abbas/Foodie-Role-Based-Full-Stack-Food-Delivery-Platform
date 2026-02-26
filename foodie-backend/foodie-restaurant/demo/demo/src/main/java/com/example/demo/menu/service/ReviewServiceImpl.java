package com.example.demo.menu.service;

import com.example.demo.menu.dto.AddReviewRequest;
import com.example.demo.menu.model.MenuItemReview;
import com.example.demo.menu.repository.MenuItemReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final MenuItemReviewRepository reviewRepository;

    @Override
    public void addOrUpdateReview(
            AddReviewRequest request,
            String userId,
            String userName
    ) {
        Optional<MenuItemReview> existing =
                reviewRepository.findByItemIdAndUserId(
                        request.getItemId(),
                        userId
                );

        MenuItemReview review =
                existing.orElseGet(MenuItemReview::new);

        review.setRestaurantId(request.getRestaurantId());
        review.setItemId(request.getItemId());
        review.setUserId(userId);
        review.setUserName(userName);
        review.setRating(request.getRating());
        review.setReview(request.getReview());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
    }
    @Override
    public List<MenuItemReview> getReviewsForRestaurant(String restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }


}
