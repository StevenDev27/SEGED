/*
backend/src/main/java/com/proyecto/seged/prediccion/dto/PrediccionResponseDTO.java
*/
package com.proyecto.seged.prediccion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PrediccionResponseDTO {

    private String productoId;
    private String nombreProducto;
    private Double stockActual;
    private String demandaPredicha;
    private Double confianza;
    private String nivelAlerta;
    private String mensajeAlerta;
    private String recomendacion;
    private String categoria;
    private String mesVenta;
    private int cantidadVendidaMes;
    private BigDecimal precioUnitario;
}
