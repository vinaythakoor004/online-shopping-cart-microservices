package com.onlineshoping.user_service.service;

import com.onlineshoping.user_service.dto.AddressResponseDto;
import com.onlineshoping.user_service.dto.UpdateProfileRequestDto;
import com.onlineshoping.user_service.dto.UserResponseDto;
import com.onlineshoping.user_service.model.User;
import com.onlineshoping.user_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public UserResponseDto getProfile(Jwt jwt) {
        User user = getOrCreateUser(jwt);
        return mapToUserResponse(user);
    }

    public User getOrCreateUser(Jwt jwt) {

        String keycloakId = jwt.getClaim("sub");

        return userRepo.findByKeycloakUserId(keycloakId)
                .orElseGet(() -> {
                    User u = User.builder()
                            .keycloakUserId(keycloakId)
                            .email(jwt.getClaim("email"))
                            .firstName(jwt.getClaim("given_name"))
                            .lastName(jwt.getClaim("family_name"))
                            .addresses(new ArrayList<>())
                            .build();
                    return userRepo.save(u);
                });
    }

    public User getUser(Jwt jwt) {
        return userRepo.getReferenceById(Long.valueOf(jwt.getSubject()));
    }

    public UserResponseDto save(Jwt jwt, UpdateProfileRequestDto updateProfileRequestDto) {
        User user = getOrCreateUser(jwt);
        user.setMobileNumber(updateProfileRequestDto.getMobileNumber());
        user.setGender(updateProfileRequestDto.getGender());
        userRepo.save(user);
        return mapToUserResponse(user);
    }

    public UserResponseDto mapToUserResponse(User user) {
        List<AddressResponseDto> addressDto = (user.getAddresses() == null) ? List.of() :
                user.getAddresses().stream()
                        .map(addr -> new AddressResponseDto(addr.getId(), addr.getAddressLine1(), addr.getAddressLine2(),
                                addr.getCity(), addr.getState(), addr.getPinCode(), addr.getCountry(), addr.isDefault()))
                        .toList();

        return UserResponseDto.builder()
                .keycloakUserId(user.getKeycloakUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .gender(user.getGender())
                .addresses(addressDto)
                .build();
    }
}
