package com.mycompany.agile.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * L'entité Professeur.
 */
@Schema(description = "L'entité Professeur.")
@Entity
@Table(name = "professeur")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Professeur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "professeur")
    @JsonIgnoreProperties(value = { "professeur" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_professeur__classe",
        joinColumns = @JoinColumn(name = "professeur_id"),
        inverseJoinColumns = @JoinColumn(name = "classe_id")
    )
    @JsonIgnoreProperties(value = { "etudiants", "professeurs" }, allowSetters = true)
    private Set<Classe> classes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Professeur id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Professeur firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Professeur lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Professeur email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Professeur phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getHireDate() {
        return this.hireDate;
    }

    public Professeur hireDate(LocalDate hireDate) {
        this.setHireDate(hireDate);
        return this;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.setProfesseur(null));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.setProfesseur(this));
        }
        this.matieres = matieres;
    }

    public Professeur matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Professeur addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.setProfesseur(this);
        return this;
    }

    public Professeur removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.setProfesseur(null);
        return this;
    }

    public Set<Classe> getClasses() {
        return this.classes;
    }

    public void setClasses(Set<Classe> classes) {
        this.classes = classes;
    }

    public Professeur classes(Set<Classe> classes) {
        this.setClasses(classes);
        return this;
    }

    public Professeur addClasse(Classe classe) {
        this.classes.add(classe);
        return this;
    }

    public Professeur removeClasse(Classe classe) {
        this.classes.remove(classe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Professeur)) {
            return false;
        }
        return getId() != null && getId().equals(((Professeur) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Professeur{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", hireDate='" + getHireDate() + "'" +
            "}";
    }
}
