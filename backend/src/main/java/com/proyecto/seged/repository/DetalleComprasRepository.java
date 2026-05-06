package com.proyecto.seged.repository;

import com.proyecto.seged.model.DetalleCompras;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleComprasRepository extends MongoRepository<DetalleCompras, String> {

    @Query("{ 'compra_id': ?0 }")
    List<DetalleCompras> findByCompraId(String compraId);
}
