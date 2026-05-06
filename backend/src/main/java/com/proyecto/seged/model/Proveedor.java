package com.proyecto.seged.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "proveedores")
public class Proveedor {

    @Id
    private String id;

    private String nombreProveedor;

    private String nit;

    private String correo;

    private String celular;

    private String direccion;


}
