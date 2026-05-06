package com.proyecto.seged.service;

import com.proyecto.seged.model.DetalleCompras;
import com.proyecto.seged.repository.DetalleComprasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleComprasService {

    @Autowired
    private DetalleComprasRepository detalleComprasRepository;

    public DetalleCompras save(DetalleCompras detalleCompras) {
        return detalleComprasRepository.save(detalleCompras);
    }

    public List<DetalleCompras> getDetalleCompras() {
        return detalleComprasRepository.findAll();
    }

    public DetalleCompras get(String id) {
        return detalleComprasRepository.findById(id).orElse(null);
    }

    public void delete(String id) {
        detalleComprasRepository.deleteById(id);
    }

    public List<DetalleCompras> getByCompraId(String compraId) {
        return detalleComprasRepository.findByCompraId(compraId);
    }
}
