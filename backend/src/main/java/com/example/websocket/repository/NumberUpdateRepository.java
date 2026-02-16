package com.example.websocket.repository;

import com.example.websocket.model.NumberUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NumberUpdateRepository extends JpaRepository<NumberUpdate, Long> {
    List<NumberUpdate> findTop10ByOrderByIdDesc();
}
//khanG
