package com.mycompany.agile.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * L'entité Matiere.
 */
@Schema(description = "L'entité Matiere.")
@Entity
@Table(name = "matiere")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Matiere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "matieres", "classes" }, allowSetters = true)
    private Professeur professeur;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Matiere id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return this.subjectName;
    }

    public Matiere subjectName(String subjectName) {
        this.setSubjectName(subjectName);
        return this;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getDescription() {
        return this.description;
    }

    public Matiere description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Professeur getProfesseur() {
        return this.professeur;
    }

    public void setProfesseur(Professeur professeur) {
        this.professeur = professeur;
    }

    public Matiere professeur(Professeur professeur) {
        this.setProfesseur(professeur);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Matiere)) {
            return false;
        }
        return getId() != null && getId().equals(((Matiere) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matiere{" +
            "id=" + getId() +
            ", subjectName='" + getSubjectName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
