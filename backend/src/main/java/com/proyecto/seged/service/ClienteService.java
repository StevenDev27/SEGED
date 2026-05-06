package com.proyecto.seged.service;

import com.proyecto.seged.model.Cliente;
import com.proyecto.seged.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public List<Cliente> getCliente() {
        return clienteRepository.findAll();
    }

    public Cliente get(String id) {
        return clienteRepository.findById(id);
    }

    public Cliente update(String id, Cliente cliente) {
        Cliente clienteActual = clienteRepository.findById(id);
        clienteActual.setNombre(cliente.getNombre());
        clienteActual.setCedula(cliente.getCedula());
        clienteActual.setCorreo(cliente.getCorreo());
        clienteActual.setCelular(cliente.getCelular());
        clienteActual.setDireccion(cliente.getDireccion());

        return clienteRepository.save(clienteActual);
    }

    public void delete(String id) {
        clienteRepository.deleteById(id);
    }
}
