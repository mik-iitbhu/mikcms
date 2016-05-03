package com.miknewscms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miknewscms.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    Post findByTitle(String title);
}
