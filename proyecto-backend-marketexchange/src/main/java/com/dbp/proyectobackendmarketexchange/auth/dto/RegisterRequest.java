package com.dbp.proyectobackendmarketexchange.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Boolean isAdmin=false;
}