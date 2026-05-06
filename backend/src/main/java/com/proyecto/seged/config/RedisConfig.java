package com.proyecto.seged.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(SessionProps.class)
public class RedisConfig {
}
