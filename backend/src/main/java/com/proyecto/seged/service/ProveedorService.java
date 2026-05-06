package com.proyecto.seged.service;

import com.proyecto.seged.model.Proveedor;
import com.proyecto.seged.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public Proveedor save(Proveedor proveedor){
        return proveedorRepository.save(proveedor);
    }

    public List<Proveedor> getProveedor(){
        return proveedorRepository.findAll();
    }

    public Proveedor get(String id){
        return proveedorRepository.findById(id);
    }

    public Proveedor update(String id, Proveedor proveedor){
        Proveedor proveedorActual = proveedorRepository.findById(id);
        proveedorActual.setNombreProveedor(proveedor.getNombreProveedor());
        proveedorActual.setNit(proveedor.getNit());
        proveedorActual.setCorreo(proveedor.getCorreo());
        proveedorActual.setCelular(proveedor.getCelular());
        proveedorActual.setDireccion(proveedor.getDireccion());

        return proveedorRepository.save(proveedorActual);
    }

    public void delete(String id){
        proveedorRepository.deleteById(id);
    }
}
