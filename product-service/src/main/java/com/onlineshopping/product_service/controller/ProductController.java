package com.onlineshopping.product_service.controller;

import com.onlineshopping.product_service.dto.ProductRequest;
import com.onlineshopping.product_service.dto.ProductResponse;
import com.onlineshopping.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart("file") MultipartFile file) throws Exception {

        return productService.createProduct(productRequest, file);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse updateProduct(
            @PathVariable String id,
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file)
            throws Exception
    {
        return productService.updateProduct(id, request, file);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ProductResponse>> bulkProductUpload(
            @RequestPart("file") MultipartFile file,
            @RequestPart("imagesZip") MultipartFile imagesZip
    ) throws Exception {
        List<ProductResponse> response = productService.bulkSave(file, imagesZip);
        return ResponseEntity.ok(response);
    }
}
