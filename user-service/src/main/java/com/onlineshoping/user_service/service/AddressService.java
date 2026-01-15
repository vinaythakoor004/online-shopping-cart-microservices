package com.onlineshoping.user_service.service;

import com.onlineshoping.user_service.dto.AddressRequestDto;
import com.onlineshoping.user_service.dto.AddressResponseDto;
import com.onlineshoping.user_service.model.Address;
import com.onlineshoping.user_service.model.User;
import com.onlineshoping.user_service.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {


    private final AddressRepository addressRepository;
    private final UserService userService;

    public AddressResponseDto addAddress(AddressRequestDto addressRequestDto, Jwt jwt) {
        User user = userService.getOrCreateUser(jwt);

        Address address = new Address();
        address.setUser(user);
        mapToAddressEntity(addressRequestDto, address);

        if (user.getAddresses().isEmpty()) {
            address.setDefault(true);
        }

        addressRepository.save(address);
        return toResponse(address);
    }

    private void mapToAddressEntity(AddressRequestDto addressRequestDto, Address address) {
        address.setAddressLine1(addressRequestDto.getAddressLine1());
        address.setAddressLine2(addressRequestDto.getAddressLine2());
        address.setCity(addressRequestDto.getCity());
        address.setState(addressRequestDto.getState());
        address.setCountry(addressRequestDto.getCountry());
        address.setPinCode(addressRequestDto.getPinCode());
    }

    private AddressResponseDto toResponse(Address address) {
        return AddressResponseDto.builder()
                .id(address.getId())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .pinCode(address.getPinCode())
                .isDefault(address.isDefault())
                .build();
    }

    public List<AddressResponseDto> getAddresses(Jwt jwt) {
        User user = userService.getUser(jwt);
        return user.getAddresses()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AddressResponseDto updateAddress (Jwt jwt, Long addressId, AddressRequestDto addressRequestDto) {
        Address address = getUserAddress(jwt, addressId);
        mapToAddressEntity(addressRequestDto, address);
        return toResponse(address);
    }

    public Address getUserAddress(Jwt jwt, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found."));

        if (!address.getUser().getKeycloakUserId().equals(jwt.getSubject())) {
            throw new RuntimeException("Unauthorized");
        }

        return address;
    }

    public void deleteAddress(Jwt jwt, Long addressId) {
        Address address = getUserAddress(jwt, addressId);
        addressRepository.delete(address);
    }

    public void setDefaultAddress(Jwt jwt, Long addressId) {
        User user = userService.getUser(jwt);
        for (Address address: user.getAddresses()) {
            address.setDefault(address.getId().equals(addressId));
        }
    }
}
