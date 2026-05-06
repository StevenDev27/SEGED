package com.proyecto.seged.repository;

import com.proyecto.seged.model.DetalleVentas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentasRepository extends MongoRepository<DetalleVentas, String> {
}
