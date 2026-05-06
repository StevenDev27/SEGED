package com.proyecto.seged.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "DetalleVentas")
public class DetalleVentas {

    @Id
    private String id;

    private String venta_id;

    private String producto_id;

    private int cantidad;

    private double precioUnitario;

    private Descuento descuento;

    private double subtotal;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Descuento {

        private String tipo;
        private double valor;
    }
}
