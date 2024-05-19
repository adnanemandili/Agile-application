package com.mycompany.agile.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EtudiantTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Etudiant getEtudiantSample1() {
        return new Etudiant().id(1L).firstName("firstName1").lastName("lastName1").email("email1").apogee("apogee1");
    }

    public static Etudiant getEtudiantSample2() {
        return new Etudiant().id(2L).firstName("firstName2").lastName("lastName2").email("email2").apogee("apogee2");
    }

    public static Etudiant getEtudiantRandomSampleGenerator() {
        return new Etudiant()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .apogee(UUID.randomUUID().toString());
    }
}
