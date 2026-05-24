package com.proyecto.seged;

import org.junit.jupiter.api.Test;
import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class TestModel {

    @Test
    public void testPrediction() throws Exception {
        System.out.println("Cargando modelo...");
        Classifier modelo = (Classifier) SerializationHelper.read("ml/demanda_j48.model");

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

        Instance instance = new DenseInstance(8);
        instance.setDataset(dataset);
        instance.setValue(0, 85);
        instance.setValue(1, 8);
        instance.setValue(2, 12.50);
        instance.setValue(3, "ELECTRONICA");
        instance.setValue(4, "JUNIO");
        instance.setValue(5, 3);
        instance.setValue(6, "true");

        System.out.println("Instancia: " + instance);

        double etiqueta = modelo.classifyInstance(instance);
        System.out.println("Etiqueta predicha (indice): " + etiqueta);
        String demandaPredicha = dataset.classAttribute().value((int) etiqueta);
        System.out.println("Demanda predicha: " + demandaPredicha);

        double[] distribucion = modelo.distributionForInstance(instance);
        double confianza = distribucion[(int) etiqueta];
        System.out.println("Confianza calculada: " + confianza);
        
        assertNotNull(demandaPredicha);
    }
}
