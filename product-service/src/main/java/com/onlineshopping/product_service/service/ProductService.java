package com.onlineshopping.product_service.service;

import com.onlineshopping.product_service.Repository.ProductRepository;
import com.onlineshopping.product_service.dto.ProductRequest;
import com.onlineshopping.product_service.dto.ProductResponse;
import com.onlineshopping.product_service.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final MinioFileService minioFileService;
    public void createProduct(ProductRequest productRequest, MultipartFile file) throws Exception {
        String imageUrl = minioFileService.uploadFile(file);

        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .skuCode(productRequest.getSkuCode())
                .price(productRequest.getPrice())
                .imageUrl(imageUrl)
                .build();

        productRepository.save(product);
        log.info("Products {} saved", product.getId());
    }


    public List<ProductResponse> getAllProducts() {
        List<Product> productList = productRepository.findAll();
        List<ProductResponse> productResponse = productList.stream()
                .map(this::mapToProductresponse)
                .toList();
        System.out.println(productResponse.toString());
        return productResponse;
    }

    private ProductResponse mapToProductresponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .skuCode(product.getSkuCode())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
