package com.onlineshoping.user_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AddressResponseDto {

    private Long id;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pinCode;
    private String country;
    private boolean isDefault;
}
