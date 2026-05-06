package com.proyecto.seged.repository;

import com.proyecto.seged.model.TipoUsuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoUsuarioRepository extends MongoRepository<TipoUsuario, String> {


    Optional<TipoUsuario> findById(String id);
}


