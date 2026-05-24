/*
backend/src/main/java/com/proyecto/seged/prediccion/util/ModeloTrainer.java
*/
package com.proyecto.seged.prediccion.util;

import weka.classifiers.meta.FilteredClassifier;
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.ConverterUtils.DataSource;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.StringToNominal;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ModeloTrainer {

    public static void main(String[] args) throws Exception {
        String arffPath = "../demanda_productos.arff";
        String modelPath = "ml/demanda_j48.model";
        if (args.length >= 2) {
            arffPath = args[0];
            modelPath = args[1];
        }

        DataSource source = new DataSource(arffPath);
        Instances data = source.getDataSet();
        if (data.classIndex() == -1) {
            data.setClassIndex(data.numAttributes() - 1);
        }

        StringToNominal stringToNominal = new StringToNominal();
        stringToNominal.setAttributeRange("4");
        stringToNominal.setInputFormat(data);

        J48 j48 = new J48();
        j48.setMinNumObj(5); // Forzar hojas con al menos 5 instancias para que haya mezcla y la confianza varíe

        FilteredClassifier filteredClassifier = new FilteredClassifier();
        filteredClassifier.setFilter(stringToNominal);
        filteredClassifier.setClassifier(j48);
        filteredClassifier.buildClassifier(data);

        Path modelFile = Paths.get(modelPath);
        if (modelFile.getParent() != null) {
            Files.createDirectories(modelFile.getParent());
        }
        SerializationHelper.write(modelPath, filteredClassifier);
        System.out.println("Modelo J48 creado en: " + modelPath);
    }
}
