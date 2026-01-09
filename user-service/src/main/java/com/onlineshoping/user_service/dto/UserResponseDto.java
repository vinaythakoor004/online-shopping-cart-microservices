package com.onlineshoping.user_service.dto;

import com.onlineshoping.user_service.model.Address;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserResponseDto {
    private String keycloakUserId;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String gender;
    private List<Address> addresses;
}
