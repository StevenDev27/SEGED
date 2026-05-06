package com.proyecto.seged.service;

import com.proyecto.seged.model.TipoUsuario;
import com.proyecto.seged.repository.TipoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoUsuarioService {

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;


    public TipoUsuario save(TipoUsuario tipoUsuario) {
        return tipoUsuarioRepository.save(tipoUsuario);
    }


    public List<TipoUsuario> getTiposUsuario() {
        return tipoUsuarioRepository.findAll();
    }


    public TipoUsuario get(String id) {
        return tipoUsuarioRepository.findById(id).orElse(null);
    }


    public void delete(String id) {
        tipoUsuarioRepository.deleteById(id);
    }
}

