package com.proyecto.seged.service;

import com.proyecto.seged.model.DetalleVentas;
import com.proyecto.seged.repository.DetalleVentasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentasService {

    @Autowired
    private DetalleVentasRepository detalleVentasRepository;

    public DetalleVentas save(DetalleVentas detalleVentas) {
        return detalleVentasRepository.save(detalleVentas);
    }

    public List<DetalleVentas> getDetalleVentas() {
        return detalleVentasRepository.findAll();
    }

    public DetalleVentas get(String id) {
        return detalleVentasRepository.findById(id).orElse(null);
    }
    public void delete(String id) {
        detalleVentasRepository.deleteById(id);
    }
}
