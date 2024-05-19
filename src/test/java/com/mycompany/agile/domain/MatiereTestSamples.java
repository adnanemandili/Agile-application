package com.mycompany.agile.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MatiereTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Matiere getMatiereSample1() {
        return new Matiere().id(1L).subjectName("subjectName1").description("description1");
    }

    public static Matiere getMatiereSample2() {
        return new Matiere().id(2L).subjectName("subjectName2").description("description2");
    }

    public static Matiere getMatiereRandomSampleGenerator() {
        return new Matiere()
            .id(longCount.incrementAndGet())
            .subjectName(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
