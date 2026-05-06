package com.proyecto.seged;

import com.proyecto.seged.config.SessionProps;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(SessionProps.class)
public class SegedApplication {

    public static void main(String[] args) {
        SpringApplication.run(SegedApplication.class, args);
    }
}
