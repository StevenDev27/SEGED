package com.proyecto.seged.repository;

import com.proyecto.seged.model.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends MongoRepository<Producto, String> {


    List<Producto> findByNombreContainingIgnoreCase(String nombre);


    List<Producto> findByDescripcionContainingIgnoreCase(String descripcion);
}

