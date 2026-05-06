package com.proyecto.seged.repository;

import com.proyecto.seged.model.Inventario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioRepository extends MongoRepository<Inventario, String> {

    List<Inventario> findByActivoTrue();

    List<Inventario> findByProducto_Id(String productoId);

    List<Inventario> findByCategoria_Id(String categoriaId);
}
