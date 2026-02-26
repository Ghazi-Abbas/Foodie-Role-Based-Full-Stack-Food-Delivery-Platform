package com.example.demo.order.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {

    private String email;

    private List<UserCartDTO> cart;
}
