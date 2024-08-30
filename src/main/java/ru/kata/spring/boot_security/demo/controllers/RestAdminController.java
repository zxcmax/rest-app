package ru.kata.spring.boot_security.demo.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
public class RestAdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final ModelMapper modelMapper;

    public RestAdminController(UserService userService, RoleService roleService, ModelMapper modelMapper) {
        this.userService = userService;
        this.roleService = roleService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/roles")
    public List<Role> getRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/users")
    public List<UserDTO> getUsers() {
        return userService.getAllUsers().stream().map(this::converteToUserDTO).collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return converteToUserDTO(userService.getUser(id));
    }

    @PostMapping("/users")
    public UserDTO addUser(@RequestBody UserDTO userDTO) {
        userService.saveUser(converteToUser(userDTO));
        return userDTO;
    }

    @PatchMapping("/users")
    public UserDTO editUser(@RequestBody UserDTO userDTO) {
        userService.saveUser(converteToUser(userDTO));
        return userDTO;
    }

    @DeleteMapping("/users")
    public UserDTO deleteUser(@RequestBody UserDTO userDTO) {
        userService.deleteUser(converteToUser(userDTO));
        return userDTO;
    }

    private User converteToUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    private UserDTO converteToUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
}