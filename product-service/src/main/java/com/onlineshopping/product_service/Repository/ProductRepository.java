package com.onlineshopping.product_service.Repository;

import com.onlineshopping.product_service.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}
