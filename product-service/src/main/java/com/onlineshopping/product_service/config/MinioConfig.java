package com.onlineshopping.product_service.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

        @Bean
        public MinioClient minioClient() {
            return MinioClient.builder()
                    .endpoint("http://localhost:9000")   // or "http://minio:9000" in Docker
                    .credentials("minioadmin", "minioadmin")
                    .build();
        }
}
