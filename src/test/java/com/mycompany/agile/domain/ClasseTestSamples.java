package com.mycompany.agile.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClasseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Classe getClasseSample1() {
        return new Classe().id(1L).className("className1").level("level1");
    }

    public static Classe getClasseSample2() {
        return new Classe().id(2L).className("className2").level("level2");
    }

    public static Classe getClasseRandomSampleGenerator() {
        return new Classe().id(longCount.incrementAndGet()).className(UUID.randomUUID().toString()).level(UUID.randomUUID().toString());
    }
}
