package com.onlineshoping.user_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpdateProfileRequestDto {
    private String mobileNumber;
    private String gender;
}
