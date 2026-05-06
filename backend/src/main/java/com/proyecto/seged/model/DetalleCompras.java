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
@Document(collection = "DetalleCompras")
public class DetalleCompras {

    @Id
    private String id;

    private String compra_id;

    private String producto_id;

    private Integer cantidad;

    private Double precioUnitario;

    private Descuentos descuentos;

    private Double subtotal;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Descuentos {
        private String tipo;
        private Double valor;
    }
}
