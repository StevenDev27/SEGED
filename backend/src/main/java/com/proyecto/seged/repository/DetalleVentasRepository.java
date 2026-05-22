package com.proyecto.seged.repository;

import com.proyecto.seged.model.DetalleVentas;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentasRepository extends MongoRepository<DetalleVentas, String> {

    List<DetalleVentas> findByProducto_id(String productoId);
}
