package com.mycompany.agile.domain;

import static com.mycompany.agile.domain.ClasseTestSamples.*;
import static com.mycompany.agile.domain.EtudiantTestSamples.*;
import static com.mycompany.agile.domain.ProfesseurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.agile.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClasseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Classe.class);
        Classe classe1 = getClasseSample1();
        Classe classe2 = new Classe();
        assertThat(classe1).isNotEqualTo(classe2);

        classe2.setId(classe1.getId());
        assertThat(classe1).isEqualTo(classe2);

        classe2 = getClasseSample2();
        assertThat(classe1).isNotEqualTo(classe2);
    }

    @Test
    void etudiantTest() throws Exception {
        Classe classe = getClasseRandomSampleGenerator();
        Etudiant etudiantBack = getEtudiantRandomSampleGenerator();

        classe.addEtudiant(etudiantBack);
        assertThat(classe.getEtudiants()).containsOnly(etudiantBack);
        assertThat(etudiantBack.getClasse()).isEqualTo(classe);

        classe.removeEtudiant(etudiantBack);
        assertThat(classe.getEtudiants()).doesNotContain(etudiantBack);
        assertThat(etudiantBack.getClasse()).isNull();

        classe.etudiants(new HashSet<>(Set.of(etudiantBack)));
        assertThat(classe.getEtudiants()).containsOnly(etudiantBack);
        assertThat(etudiantBack.getClasse()).isEqualTo(classe);

        classe.setEtudiants(new HashSet<>());
        assertThat(classe.getEtudiants()).doesNotContain(etudiantBack);
        assertThat(etudiantBack.getClasse()).isNull();
    }

    @Test
    void professeurTest() throws Exception {
        Classe classe = getClasseRandomSampleGenerator();
        Professeur professeurBack = getProfesseurRandomSampleGenerator();

        classe.addProfesseur(professeurBack);
        assertThat(classe.getProfesseurs()).containsOnly(professeurBack);
        assertThat(professeurBack.getClasses()).containsOnly(classe);

        classe.removeProfesseur(professeurBack);
        assertThat(classe.getProfesseurs()).doesNotContain(professeurBack);
        assertThat(professeurBack.getClasses()).doesNotContain(classe);

        classe.professeurs(new HashSet<>(Set.of(professeurBack)));
        assertThat(classe.getProfesseurs()).containsOnly(professeurBack);
        assertThat(professeurBack.getClasses()).containsOnly(classe);

        classe.setProfesseurs(new HashSet<>());
        assertThat(classe.getProfesseurs()).doesNotContain(professeurBack);
        assertThat(professeurBack.getClasses()).doesNotContain(classe);
    }
}
