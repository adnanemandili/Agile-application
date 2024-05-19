package com.mycompany.agile.domain;

import static com.mycompany.agile.domain.ClasseTestSamples.*;
import static com.mycompany.agile.domain.EtudiantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.agile.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtudiantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etudiant.class);
        Etudiant etudiant1 = getEtudiantSample1();
        Etudiant etudiant2 = new Etudiant();
        assertThat(etudiant1).isNotEqualTo(etudiant2);

        etudiant2.setId(etudiant1.getId());
        assertThat(etudiant1).isEqualTo(etudiant2);

        etudiant2 = getEtudiantSample2();
        assertThat(etudiant1).isNotEqualTo(etudiant2);
    }

    @Test
    void classeTest() throws Exception {
        Etudiant etudiant = getEtudiantRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        etudiant.setClasse(classeBack);
        assertThat(etudiant.getClasse()).isEqualTo(classeBack);

        etudiant.classe(null);
        assertThat(etudiant.getClasse()).isNull();
    }
}
