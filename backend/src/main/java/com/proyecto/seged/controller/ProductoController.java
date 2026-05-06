package com.proyecto.seged.controller;

import com.proyecto.seged.model.Producto;
import com.proyecto.seged.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;


    @PostMapping
    public ResponseEntity<Producto> save(@RequestBody Producto producto) {
        return new ResponseEntity<>(productoService.save(producto), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<Producto>> getProductos() {
        return new ResponseEntity<>(productoService.getProductos(), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Producto> get(@PathVariable String id) {
        return new ResponseEntity<>(productoService.get(id), HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        productoService.delete(id);
        return new ResponseEntity<>("Eliminación exitosa", HttpStatus.OK);
    }
}
