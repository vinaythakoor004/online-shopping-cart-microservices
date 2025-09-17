package com.onlineshopping.order_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InventoryResponse {
    private String skuCode;
    private boolean isInStock;
}
