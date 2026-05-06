package com.proyecto.seged.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "Inventario")
public class Inventario {

    @Id
    private String id;

    @DBRef
    private Producto producto;

    @DBRef
    private Categoria categoria;

    private Double stockActual;
    private Double stockMinimo;
    private Double stockMaximo;

    private String almacen;
    private String pasillo;

    private List<Movimiento> movimientos;

    private Date fechaUltimaActualizacion = new Date();
    private Boolean activo = true;

    @Getter @Setter
    public static class Movimiento {
        private Date fechaMovimiento = new Date();
        private String tipoMovimiento;
        private Double cantidad;
        private String motivo;

        private String usuarioId;
        private String ventaId;
        private String compraId;

        private Double stockAnterior;
        private Double stockNuevo;
    }
}
