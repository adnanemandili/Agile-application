package com.mycompany.agile.domain;

import static com.mycompany.agile.domain.ClasseTestSamples.*;
import static com.mycompany.agile.domain.MatiereTestSamples.*;
import static com.mycompany.agile.domain.ProfesseurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.agile.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProfesseurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Professeur.class);
        Professeur professeur1 = getProfesseurSample1();
        Professeur professeur2 = new Professeur();
        assertThat(professeur1).isNotEqualTo(professeur2);

        professeur2.setId(professeur1.getId());
        assertThat(professeur1).isEqualTo(professeur2);

        professeur2 = getProfesseurSample2();
        assertThat(professeur1).isNotEqualTo(professeur2);
    }

    @Test
    void matiereTest() throws Exception {
        Professeur professeur = getProfesseurRandomSampleGenerator();
        Matiere matiereBack = getMatiereRandomSampleGenerator();

        professeur.addMatiere(matiereBack);
        assertThat(professeur.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getProfesseur()).isEqualTo(professeur);

        professeur.removeMatiere(matiereBack);
        assertThat(professeur.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getProfesseur()).isNull();

        professeur.matieres(new HashSet<>(Set.of(matiereBack)));
        assertThat(professeur.getMatieres()).containsOnly(matiereBack);
        assertThat(matiereBack.getProfesseur()).isEqualTo(professeur);

        professeur.setMatieres(new HashSet<>());
        assertThat(professeur.getMatieres()).doesNotContain(matiereBack);
        assertThat(matiereBack.getProfesseur()).isNull();
    }

    @Test
    void classeTest() throws Exception {
        Professeur professeur = getProfesseurRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        professeur.addClasse(classeBack);
        assertThat(professeur.getClasses()).containsOnly(classeBack);

        professeur.removeClasse(classeBack);
        assertThat(professeur.getClasses()).doesNotContain(classeBack);

        professeur.classes(new HashSet<>(Set.of(classeBack)));
        assertThat(professeur.getClasses()).containsOnly(classeBack);

        professeur.setClasses(new HashSet<>());
        assertThat(professeur.getClasses()).doesNotContain(classeBack);
    }
}
