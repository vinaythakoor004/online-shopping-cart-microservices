package com.onlineshoping.user_service.controller;

import com.onlineshoping.user_service.dto.UpdateProfileRequestDto;
import com.onlineshoping.user_service.dto.UserResponseDto;
import com.onlineshoping.user_service.model.User;
import com.onlineshoping.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/me")
public class MeController {

    @Autowired
    private UserService userService;

    @GetMapping
    public UserResponseDto getProfile(Jwt jwt) {
        System.out.println(jwt);
        return userService.getProfile(jwt);
    }

    @PutMapping
    public UserResponseDto updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdateProfileRequestDto req
    ) {
        return userService.save(jwt, req);
    }
}
