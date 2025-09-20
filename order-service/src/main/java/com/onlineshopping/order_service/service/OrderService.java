package com.onlineshopping.order_service.service;

import com.onlineshopping.order_service.dto.InventoryResponse;
import com.onlineshopping.order_service.dto.OrderLineItemsDto;
import com.onlineshopping.order_service.dto.OrderRequest;
import com.onlineshopping.order_service.model.Order;
import com.onlineshopping.order_service.model.OrderLineItems;
import com.onlineshopping.order_service.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.Tracer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient.Builder webClientBuilder;
    private final Tracer tracer;


    @CircuitBreaker(name="inventory", fallbackMethod = "fallbackMethod1")
    @TimeLimiter(name = "inventory", fallbackMethod = "fallbackMethod1")
    @Retry(name = "inventory", fallbackMethod = "fallbackMethod1")
    public CompletableFuture<String> placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());

        List<OrderLineItems> orderLineItems = orderRequest.getOrderLineItemsDtoList()
                .stream()
                .map(this::mapToDto)
                .toList();

        order.setOrderLineItemsList(orderLineItems);

        List<String> skuCodes = order.getOrderLineItemsList().stream()
                .map(OrderLineItems::getSkuCode).toList();

        Span newSpan = this.tracer.nextSpan().name("my-custom-span").start();
        try (Tracer.SpanInScope ws = this.tracer.withSpan(newSpan.start())) {
            // call inventory service to check if product is in stock or not
            return CompletableFuture.supplyAsync(() -> {
                // call inventory service to check if product is in stock or not
                InventoryResponse[] inventoryResponseArray = webClientBuilder.build().get()
                        .uri("http://inventory-service//api/inventory",
                                uriBuilder -> uriBuilder.queryParam("skuCode", skuCodes).build())
                        .retrieve()
                        .bodyToMono(InventoryResponse[].class)
                        .block(); // Blocking call must be inside the supplyAsync lambda

                boolean allProductsInStock = Arrays.stream(inventoryResponseArray).allMatch(InventoryResponse::isInStock);

                if (!allProductsInStock) {
                    throw new IllegalArgumentException("Product is not in stock. Please try again later.");
                } else {
                    orderRepository.save(order);
                    return "order placed successfully";
                }
            });
        } finally {
            newSpan.end();
        }
    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setSkuCode(orderLineItemsDto.getSkuCode());
        orderLineItems.setPrice(orderLineItemsDto.getPrice());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        return orderLineItems;
    }

    public CompletableFuture<String> fallbackMethod1(OrderRequest orderRequest, RuntimeException runtimeException) {
        return CompletableFuture.supplyAsync(() -> "Oops! Something went wrong, Please place order after some time!");
    }
}
