package com.proyecto.seged.service;

import com.proyecto.seged.model.Producto;
import com.proyecto.seged.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;


    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }


    public List<Producto> getProductos() {
        return productoRepository.findAll();
    }


    public Producto get(String id) {
        return productoRepository.findById(id).orElse(null);
    }


    public void delete(String id) {
        productoRepository.deleteById(id);
    }
}

