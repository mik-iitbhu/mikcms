package com.miknewscms.repository;

import java.util.List;

import com.miknewscms.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByRole(String role);
    User findByEmail(String email);
}
