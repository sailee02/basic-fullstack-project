package com.example.backend;

import org.springframework.web.bind.annotation.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final AtomicLong counter = new AtomicLong();

    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setId(counter.incrementAndGet());
        return user;
    }
}
