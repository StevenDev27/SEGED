package com.proyecto.seged.controller;

import com.proyecto.seged.model.TipoUsuario;
import com.proyecto.seged.service.TipoUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-usuario")
public class TipoUsuarioController {

    @Autowired
    private TipoUsuarioService tipoUsuarioService;


    @PostMapping
    public ResponseEntity<TipoUsuario> save(@RequestBody TipoUsuario tipoUsuario) {
        return new ResponseEntity<>(tipoUsuarioService.save(tipoUsuario), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<TipoUsuario>> getTiposUsuario() {
        return new ResponseEntity<>(tipoUsuarioService.getTiposUsuario(), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<TipoUsuario> get(@PathVariable String id) {
        TipoUsuario tu = tipoUsuarioService.get(id);
        if (tu == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(tu, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        tipoUsuarioService.delete(id);
        return new ResponseEntity<>("Eliminación exitosa", HttpStatus.OK);
    }
}


