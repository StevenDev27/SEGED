package com.proyecto.seged.security;

import com.proyecto.seged.config.SessionProps;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class TokenStore {

    private static final String PREFIX = "auth:allow:";
    private final StringRedisTemplate redis;
    private final SessionProps sessionProps;

    private String keyFor(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(token.getBytes(StandardCharsets.UTF_8));
            return PREFIX + HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo calcular SHA-256 del token", e);
        }
    }

    public void save(String token) {
        Duration ttl = Duration.ofMinutes(10);
        redis.opsForValue().set(keyFor(token), "1", ttl);
    }

    public boolean exists(String token) {
        return Boolean.TRUE.equals(redis.hasKey(keyFor(token)));
    }

    public void refresh(String token) {
        Duration ttl = Duration.ofMinutes(10);
        redis.expire(keyFor(token), ttl);
    }

    public void delete(String token) {
        redis.delete(keyFor(token));
    }
}
