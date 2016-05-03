package com.miknewscms.repository;

import com.miknewscms.model.Event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface CalenderRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartBetween(Date leftDate, Date rightDate);
}
