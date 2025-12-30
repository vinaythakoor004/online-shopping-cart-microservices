package com.onlineshopping.product_service.service;

import com.onlineshopping.product_service.Repository.ProductRepository;
import com.onlineshopping.product_service.dto.ProductRequest;
import com.onlineshopping.product_service.dto.ProductResponse;
import com.onlineshopping.product_service.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final MinioFileService minioFileService;
    private final String productList = "productList";
    private final String product = "product";

    @CachePut(cacheNames = product, key = "#result.id")
    @CacheEvict(cacheNames = productList, key = "'all'")
    public ProductResponse createProduct(ProductRequest productRequest, MultipartFile file) throws Exception {

        String imageUrl = minioFileService.uploadFile(file.getOriginalFilename(), file.getInputStream(), file.getSize(), file.getContentType());
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .skuCode(productRequest.getSkuCode())
                .price(productRequest.getPrice())
                .imageUrl(imageUrl)
                .build();


        Product saved = productRepository.save(product);
        log.info("Products {} saved", product.getId());
        return mapToProductResponse(saved);
    }

    @Cacheable(cacheNames = productList, key = "'all'")
    public List<ProductResponse> getAllProducts() {
        List<Product> productList = productRepository.findAll();
        List<ProductResponse> productResponse = productList.stream()
                .map(this::mapToProductResponse)
                .toList();
        System.out.println(productResponse.toString());
        return productResponse;
    }

    @CachePut(cacheNames = product, key = "#result.id")
    @CacheEvict(cacheNames = productList, key = "'all'")
    public ProductResponse updateProduct(
            String id,
            ProductRequest request,
            MultipartFile file) throws Exception {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSkuCode(request.getSkuCode());
        product.setPrice(request.getPrice());

        if (file != null && !file.isEmpty()) {
            String imageUrl = minioFileService.uploadFile(file.getOriginalFilename(), file.getInputStream(), file.getSize(), file.getContentType());
            product.setImageUrl(imageUrl);
        }

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .skuCode(product.getSkuCode())
                .imageUrl(product.getImageUrl())
                .build();
    }

    @Caching(evict = {
        @CacheEvict(cacheNames = product, key = "#id"),
        @CacheEvict(cacheNames = productList, key = "'all'")
    })
    public void deleteProduct(String id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            minioFileService.deleteFile(product.getImageUrl());
        }

        productRepository.deleteById(id);
    }

    private List<ProductRequest> parseCsv(MultipartFile file) throws IOException {

        try (Reader reader = new InputStreamReader(file.getInputStream())) {

            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setTrim(true)
                    .build();

            CSVParser parser = format.parse(reader);

            List<ProductRequest> products = new ArrayList<>();

            for (CSVRecord record : parser) {
                products.add(new ProductRequest(
                        record.get("name"),
                        record.get("description"),
                        record.get("skuCode"),
                        new BigDecimal(record.get("price"))
                ));
            }
            return products;
        }
    }

    private Map<String, byte[]> unzipImages(MultipartFile zipFile) throws IOException {

        Map<String, byte[]> imageMap = new HashMap<>();

        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;

            while ((entry = zis.getNextEntry()) != null) {

                if (entry.isDirectory()) continue;

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                zis.transferTo(baos);

                imageMap.put(entry.getName(), baos.toByteArray());
            }
        }
        return imageMap;
    }

    @Transactional
    @CacheEvict(cacheNames = productList, key = "'all'")
    public List<ProductResponse> bulkSave(MultipartFile csvFile, MultipartFile imagesZip) throws Exception {

        List<ProductRequest> rows = parseCsv(csvFile);
        Map<String, byte[]> images = unzipImages(imagesZip);
        List<ProductResponse> productResponse = new ArrayList<>();

        for (ProductRequest row : rows) {
            String imageName = row.getSkuCode() + ".webp";
            byte[] imageData = images.get(imageName);

            if (imageData  == null) {
                throw new RuntimeException("Missing image: " + row.getSkuCode());
            }

            String imageUrl = minioFileService.uploadFile(imageName, new ByteArrayInputStream(imageData), imageData.length, "image/webp");

            Product product = Product.builder()
                    .name(row.getName())
                    .description(row.getDescription())
                    .skuCode(row.getSkuCode())
                    .price(row.getPrice())
                    .imageUrl(imageUrl)
                    .build();

            productRepository.save(product);
            Product saved = productRepository.save(product);
            productResponse.add(mapToProductResponse(saved));
        }
        return productResponse;
    }
}
