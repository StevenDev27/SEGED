package com.proyecto.seged.controller;

import com.proyecto.seged.model.DetalleVentas;
import com.proyecto.seged.service.DetalleVentasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle_ventas")
public class DetalleVentasController {

    @Autowired
    private DetalleVentasService detalleVentasService;

    @PostMapping
    public ResponseEntity<DetalleVentas> save(@RequestBody DetalleVentas detalleVentas) {
        return new ResponseEntity<>(detalleVentasService.save(detalleVentas), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DetalleVentas>> getDestalleVentas() {
        return new ResponseEntity<>(detalleVentasService.getDetalleVentas(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVentas> get(@PathVariable  String id) {
        return new ResponseEntity<>(detalleVentasService.get(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        detalleVentasService.delete(id);
        return new ResponseEntity<>("Eliminación exitosa", HttpStatus.OK);
    }
}
