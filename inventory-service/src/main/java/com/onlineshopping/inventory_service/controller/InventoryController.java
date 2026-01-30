package com.onlineshopping.inventory_service.controller;

import com.onlineshopping.inventory_service.dto.InventoryRequest;
import com.onlineshopping.inventory_service.dto.InventoryResponse;
import com.onlineshopping.inventory_service.dto.RemoveStockRequest;
import com.onlineshopping.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> isInStock(@RequestParam List<String> skuCode) {
        return inventoryService.isInStock(skuCode);
    }

    @PostMapping
    public void createInventory(@RequestBody InventoryRequest request) {
        inventoryService.createInventory(
                request.getSkuCode(),
                request.getQuantity()
        );
    }

    @DeleteMapping("/{skuCode}")
    public void deleteInventory(@PathVariable String skuCode) {
        inventoryService.deleteBySkuCode(skuCode);
    }

    // ➕ ADD STOCK (Admin)
    @PostMapping("/add-stock")
    public ResponseEntity<Void> addStock(@RequestBody InventoryRequest request) {
        inventoryService.addStock(
                request.getSkuCode(),
                request.getQuantity()
        );
        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove-stock")
    public ResponseEntity<Void> removeStock(@RequestBody RemoveStockRequest request) {
        inventoryService.removeStock(
                request.getSkuCode(),
                request.getQuantity()
        );
        return ResponseEntity.ok().build();
    }
}
