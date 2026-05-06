
package com.proyecto.seged.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Document(collection = "TipoUsuarioRepository")
public class TipoUsuario {


    @Id
    private String id;


    private Rol tipo;

    public enum Rol {
        Admnistrador,
        Vendedor,
        Cliente,
        Provedor,
    }


    private Map<String, Object> informacion_contacto;

    private String nombre;
    private String identificacion;
    private String telefono;
    private String email;

    private Map<String, Object> direccion;
    private String calle;
    private String ciudad;
    private String codigo_postal;

    private Date fecha_registro = new Date();
    private Boolean activo = true;
}
