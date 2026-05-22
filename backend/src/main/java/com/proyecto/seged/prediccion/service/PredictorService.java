/*
backend/src/main/java/com/proyecto/seged/prediccion/service/PredictorService.java
*/
package com.proyecto.seged.prediccion.service;

import com.proyecto.seged.prediccion.dto.PrediccionRequestDTO;
import com.proyecto.seged.prediccion.dto.PrediccionResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import weka.classifiers.Classifier;
import weka.classifiers.trees.J48;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictorService {

    @Value("${seged.ml.modelo-path:ml/demanda_j48.model}")
    private String modeloPath;

    private Classifier modelo;
    private boolean modeloCargado;
    private Instances estructura;

    @PostConstruct
    public void init() {
        estructura = construirEstructura();
        cargarModelo();
    }

    private void cargarModelo() {
        try {
            Path path = Paths.get(modeloPath);
            if (Files.exists(path)) {
                modelo = (Classifier) SerializationHelper.read(modeloPath);
                modeloCargado = true;
                log.info("Modelo de demanda cargado desde {}", modeloPath);
            } else {
                modeloCargado = false;
                log.warn("No se encontró el modelo {}. Usando fallback por reglas.", modeloPath);
            }
        } catch (Exception exception) {
            modeloCargado = false;
            log.error("Error cargando el modelo de demanda: {}", exception.getMessage(), exception);
        }
    }

    public PrediccionResponseDTO predecir(PrediccionRequestDTO request) {
        if (!modeloCargado) {
            return construirRespuesta(request, clasificarPorReglas(request.getCantidadVendidaMes()), 1.0);
        }

        try {
            Instance instancia = crearInstancia(request);
            double etiqueta = modelo.classifyInstance(instancia);
            String demandaPredicha = estructura.classAttribute().value((int) etiqueta);
            double[] distribucion = modelo.distributionForInstance(instancia);
            double confianza = distribucion[(int) etiqueta];
            return construirRespuesta(request, demandaPredicha, confianza);
        } catch (Exception exception) {
            log.error("Error al predecir demanda: {}", exception.getMessage(), exception);
            return construirRespuesta(request, clasificarPorReglas(request.getCantidadVendidaMes()), 1.0);
        }
    }

    private Instance crearInstancia(PrediccionRequestDTO request) {
        Instance instance = new DenseInstance(8);
        instance.setDataset(estructura);
        instance.setValue(0, request.getCantidadVendidaMes());
        instance.setValue(1, request.getStockActual() == null ? 0.0 : request.getStockActual());
        instance.setValue(2, request.getPrecioUnitario() == null ? 0.0 : request.getPrecioUnitario().doubleValue());
        instance.setValue(3, request.getCategoria() == null ? "SIN CATEGORIA" : request.getCategoria().toUpperCase());
        String mesVenta = request.getMesVenta() == null ? "ENERO" : request.getMesVenta().toUpperCase();
        try {
            instance.setValue(4, mesVenta);
        } catch (IllegalArgumentException e) {
            instance.setValue(4, "ENERO");
        }
        instance.setValue(5, request.getFrecuenciaReposicion());
        instance.setValue(6, request.isTienePromocion() ? "true" : "false");
        return instance;
    }

    private Instances construirEstructura() {
        ArrayList<Attribute> attributes = new ArrayList<>();
        attributes.add(new Attribute("cantidadVendidaMes"));
        attributes.add(new Attribute("stockActual"));
        attributes.add(new Attribute("precioUnitario"));
        attributes.add(new Attribute("categoria", (ArrayList<String>) null));
        attributes.add(new Attribute("mesVenta", new ArrayList<>(Arrays.asList(
                "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
        ))));
        attributes.add(new Attribute("frecuenciaReposicion"));
        attributes.add(new Attribute("tienePromocion", new ArrayList<>(Arrays.asList("false", "true"))));
        attributes.add(new Attribute("demanda", new ArrayList<>(Arrays.asList("ALTA", "MEDIA", "BAJA"))));

        Instances dataset = new Instances("demanda_productos", attributes, 0);
        dataset.setClassIndex(dataset.numAttributes() - 1);
        return dataset;
    }

    private String clasificarPorReglas(int cantidadVendidaMes) {
        if (cantidadVendidaMes >= 80) {
            return "ALTA";
        }
        if (cantidadVendidaMes >= 30) {
            return "MEDIA";
        }
        return "BAJA";
    }

    public PrediccionResponseDTO construirRespuesta(PrediccionRequestDTO request, String demandaPredicha, double confianza) {
        String nivelAlerta = "NORMAL";
        String mensajeAlerta = "Sin alerta";
        String recomendacion = "No se requiere acción inmediata";
        double stockActual = request.getStockActual() == null ? 0.0 : request.getStockActual();

        if ("ALTA".
                equalsIgnoreCase(demandaPredicha)) {
            if (stockActual < 10) {
                nivelAlerta = "CRITICA";
                mensajeAlerta = "Reabastecer de inmediato";
                recomendacion = "Reponer stock urgente para cubrir la demanda.";
            } else {
                nivelAlerta = "ADVERTENCIA";
                mensajeAlerta = "Se recomienda reabastecer";
                recomendacion = "Planificar el reabastecimiento pronto.";
            }
        }

        return PrediccionResponseDTO.builder()
                .productoId(request.getProductoId())
                .nombreProducto(request.getNombreProducto())
                .stockActual(request.getStockActual())
                .demandaPredicha(demandaPredicha)
                .confianza(confianza)
                .nivelAlerta(nivelAlerta)
                .mensajeAlerta(mensajeAlerta)
                .recomendacion(recomendacion)
                .categoria(request.getCategoria())
                .mesVenta(request.getMesVenta())
                .cantidadVendidaMes(request.getCantidadVendidaMes())
                .precioUnitario(request.getPrecioUnitario())
                .build();
    }
}
