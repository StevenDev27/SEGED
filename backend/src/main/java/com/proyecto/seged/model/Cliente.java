package com.proyecto.seged.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "clientes")
public class Cliente {

    @Id
    private String id;

    private String nombre;

    private String cedula;

    private String correo;

    private String celular;

    private String direccion;

}
