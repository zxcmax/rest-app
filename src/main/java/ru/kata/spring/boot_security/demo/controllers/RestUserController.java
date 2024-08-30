package ru.kata.spring.boot_security.demo.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.models.User;

@RestController
@RequestMapping("/api/v1/user")
public class RestUserController {

    private final ModelMapper modelMapper;

    public RestUserController(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public UserDTO getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return converteToUserDTO((User) authentication.getPrincipal());
    }

    private UserDTO converteToUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
}