package vau.ac.lk.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.config.JwtUtils;
import vau.ac.lk.backend.models.User;
import vau.ac.lk.backend.services.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passEncoder;

    public AuthController(UserService userService, JwtUtils jwtUtils, PasswordEncoder passEncoder) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passEncoder = passEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);

            String token = jwtUtils.generateToken(savedUser.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("user", savedUser);
            response.put("token", token);

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Email already exists or invalid data");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        return userService.findByEmail(email)
                .filter(user -> passEncoder.matches(password, user.getPassword()))
                .map(user -> {
                   String token = jwtUtils.generateToken(user.getEmail());
                   Map<String, Object> response = new HashMap<>();
                   response.put("token", token);
                   response.put("user", user);
                   return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.status(401).body("Invalid email or password"));
    }
}
