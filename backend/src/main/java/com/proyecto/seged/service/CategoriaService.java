package com.proyecto.seged.service;

import com.proyecto.seged.model.Categoria;
import com.proyecto.seged.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Categoria save(Categoria categoria){
        return categoriaRepository.save(categoria);
    }

    public List<Categoria> getCategoria(){
        return categoriaRepository.findAll();
    }

    public Categoria get(String id){
        return categoriaRepository.findById(id).orElse(null);
    }

    public void delete(String id) {
        categoriaRepository.deleteById(id);
    }

    public Categoria update(String id, Categoria categoriaActualizada) {
        Optional<Categoria> categoriaExistente = categoriaRepository.findById(id);

        if (categoriaExistente.isPresent()) {
            Categoria categoria = categoriaExistente.get();

            categoria.setNombre(categoriaActualizada.getNombre());
            categoria.setDescripcion(categoriaActualizada.getDescripcion());
            categoria.setFechaCreacion(categoriaActualizada.getFechaCreacion());

            return categoriaRepository.save(categoria);
        } else {
            throw new RuntimeException("No se encontró la categoría con ID: " + id);
        }
    }
}
