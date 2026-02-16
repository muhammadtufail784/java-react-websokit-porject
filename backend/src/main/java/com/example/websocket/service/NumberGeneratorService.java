package com.example.websocket.service;

import com.example.websocket.model.NumberUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class NumberGeneratorService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private com.example.websocket.repository.NumberUpdateRepository repository;

    private final Random random = new Random();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Scheduled(fixedRate = 2000)
    public void generateAndSendNumbers() {
        double leftValue = 10 + (90 * random.nextDouble());
        double rightValue = 10 + (90 * random.nextDouble());
        String timestamp = LocalDateTime.now().format(formatter);

        NumberUpdate update = new NumberUpdate(
                Math.round(leftValue * 100.0) / 100.0,
                Math.round(rightValue * 100.0) / 100.0,
                timestamp);

        // Save to Database
        repository.save(update);

        messagingTemplate.convertAndSend("/topic/numbers", update);
    }
}
