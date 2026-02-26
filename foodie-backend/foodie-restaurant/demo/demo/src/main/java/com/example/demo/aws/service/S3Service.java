package com.example.demo.aws.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadImage(MultipartFile file) {

        String fileName = "restaurant-images/"
                + UUID.randomUUID()
                + "-"
                + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            amazonS3.putObject(
                    bucketName,
                    fileName,
                    file.getInputStream(),
                    metadata
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to S3", e);
        }

        return amazonS3.getUrl(bucketName, fileName).toString();
    }
}

