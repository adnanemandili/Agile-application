package com.mycompany.agile.domain;

import static com.mycompany.agile.domain.MatiereTestSamples.*;
import static com.mycompany.agile.domain.ProfesseurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.agile.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MatiereTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Matiere.class);
        Matiere matiere1 = getMatiereSample1();
        Matiere matiere2 = new Matiere();
        assertThat(matiere1).isNotEqualTo(matiere2);

        matiere2.setId(matiere1.getId());
        assertThat(matiere1).isEqualTo(matiere2);

        matiere2 = getMatiereSample2();
        assertThat(matiere1).isNotEqualTo(matiere2);
    }

    @Test
    void professeurTest() throws Exception {
        Matiere matiere = getMatiereRandomSampleGenerator();
        Professeur professeurBack = getProfesseurRandomSampleGenerator();

        matiere.setProfesseur(professeurBack);
        assertThat(matiere.getProfesseur()).isEqualTo(professeurBack);

        matiere.professeur(null);
        assertThat(matiere.getProfesseur()).isNull();
    }
}
