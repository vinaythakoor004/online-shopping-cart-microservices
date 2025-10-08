package com.onlineshopping.inventory_service.service;

import com.onlineshopping.inventory_service.dto.InventoryResponse;
import com.onlineshopping.inventory_service.model.Inventory;
import com.onlineshopping.inventory_service.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    @SneakyThrows
    public List<InventoryResponse> isInStock(List<String> skuCode) {
        log.info("wait started");
//        Thread.sleep(10000);
        log.info("wait ended");

        log.info("Start -- received request to check skuCode {}", skuCode);
        List<Inventory> inventories = inventoryRepository.findBySkuCodeIn(skuCode);
        log.info("Fetched {} inventories: {}", inventories.size(), inventories);
//        Boolean isInStock = inventoryRepository.existsBySkuIdAndQuantityIsGreaterThanEqual(skuCode, quantity);
        return inventories.stream()
                        .map(inventory ->
                                InventoryResponse.builder()
                                        .skuCode(inventory.getSkuCode())
                                        .isInStock(inventory.getQuantity() > 0)
                                        .build()).toList();
    }

}
