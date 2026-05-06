package com.proyecto.seged.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "Compras")
public class Compras {

    @Id
    private String id;

    private String proveedor_id;

    private String usuario_id;

    private InformacionCompra informacionCompra;

    private Calculo calculo;

    private String estado;

    private Instant fechaCreacion;

    private Instant fechaActualizacion;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class InformacionCompra {

        private String numero;
        private Instant fecha;
        private String metodoPago;
        private String tipo;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Calculo {

        private double subtotal;
        private double impuestos;
        private double descuentos;
        private double total;
    }
}
