package com.proyecto.seged.repository;

import com.proyecto.seged.model.DetalleVentas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.Query;

@Repository
public interface DetalleVentasRepository extends MongoRepository<DetalleVentas, String> {

    @Query("{ 'producto_id' : ?0 }")
    List<DetalleVentas> findByProducto_id(String productoId);
}
