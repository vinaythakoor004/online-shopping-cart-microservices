package com.onlineshoping.user_service.controller;

import com.onlineshoping.user_service.dto.AddressRequestDto;
import com.onlineshoping.user_service.dto.AddressResponseDto;
import com.onlineshoping.user_service.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/me/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public AddressResponseDto addAddress(
            @RequestBody @Valid AddressRequestDto addressRequestDto,
            @AuthenticationPrincipal Jwt jwt
            ) {
        return addressService.addAddress(addressRequestDto, jwt);
    }

    @GetMapping
    public List<AddressResponseDto> getAddresses(@AuthenticationPrincipal Jwt jwt) {
        return addressService.getAddresses(jwt);
    }

    @PutMapping("/{addressId}")
    public AddressResponseDto updateAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long addressId,
            @RequestBody @Valid AddressRequestDto addressRequestDto
    ) {
        return addressService.updateAddress(jwt, addressId, addressRequestDto);
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long addressId
    ) {
        addressService.deleteAddress(jwt, addressId);
    }

    @PutMapping("/{addressId}/default")
    public void setDefaultAddress(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long addressId
    ) {
        addressService.setDefaultAddress(jwt, addressId);
    }
}
