package com.proyecto.seged.repository;

import com.proyecto.seged.model.Ventas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentasRepository extends MongoRepository<Ventas, String> {

}
