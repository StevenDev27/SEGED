/*
backend/src/main/java/com/proyecto/seged/prediccion/dto/PrediccionRequestDTO.java
*/
package com.proyecto.seged.prediccion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrediccionRequestDTO {

    private String productoId;
    private String nombreProducto;
    private int cantidadVendidaMes;
    private Double stockActual;
    private BigDecimal precioUnitario;
    private String categoria;
    private String mesVenta;
    private int frecuenciaReposicion;
    private boolean tienePromocion;
}
