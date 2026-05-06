package com.proyecto.seged.repository;

import com.proyecto.seged.model.Proveedor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends MongoRepository<Proveedor, Integer> {

    Proveedor findById(String id);

    void deleteById(String id);
}
