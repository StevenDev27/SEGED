package com.proyecto.seged.controller;

import com.proyecto.seged.model.Proveedor;
import com.proyecto.seged.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @PostMapping
    public ResponseEntity<Proveedor> save(@RequestBody Proveedor proveedor) {
        return new ResponseEntity<>(proveedorService.save(proveedor), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Proveedor>> getProveedor() {
        return new ResponseEntity<>(proveedorService.getProveedor(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> get(@PathVariable String id) {
        return new ResponseEntity<>(proveedorService.get(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> update(@PathVariable String id, @RequestBody Proveedor proveedor) {
        return new ResponseEntity<>(proveedorService.update(id, proveedor), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        proveedorService.delete(id);
        return new ResponseEntity<>("Proveedor eliminado con éxito", HttpStatus.OK);
    }
}
