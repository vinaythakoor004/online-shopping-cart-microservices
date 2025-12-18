package com.onlineshopping.product_service.controller;

import com.onlineshopping.product_service.dto.ProductRequest;
import com.onlineshopping.product_service.dto.ProductResponse;
import com.onlineshopping.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public void createProduct(
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart("file") MultipartFile file) throws Exception {

        productService.createProduct(productRequest, file);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }
}
