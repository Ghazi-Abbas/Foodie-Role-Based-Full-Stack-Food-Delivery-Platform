package com.example.User.repository;

import com.example.User.mode.UserProfile;
import org.apache.catalina.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserProfileRepository
        extends MongoRepository<UserProfile, String> {

    boolean existsByEmail(String email);
    Optional<UserProfile> findByEmail(String email);

}
