package com.mycompany.agile.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.agile.domain.enumeration.Filiere;
import com.mycompany.agile.domain.enumeration.Niveau;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * L'entité Etudiant.
 */
@Schema(description = "L'entité Etudiant.")
@Entity
@Table(name = "etudiant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Etudiant implements Serializable {

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

    @NotNull
    @Column(name = "apogee", nullable = false)
    private String apogee;

    @Enumerated(EnumType.STRING)
    @Column(name = "niveau")
    private Niveau niveau;

    @Enumerated(EnumType.STRING)
    @Column(name = "filere")
    private Filiere filere;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "etudiants", "professeurs" }, allowSetters = true)
    private Classe classe;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etudiant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Etudiant firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Etudiant lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Etudiant email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getApogee() {
        return this.apogee;
    }

    public Etudiant apogee(String apogee) {
        this.setApogee(apogee);
        return this;
    }

    public void setApogee(String apogee) {
        this.apogee = apogee;
    }

    public Niveau getNiveau() {
        return this.niveau;
    }

    public Etudiant niveau(Niveau niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }

    public Filiere getFilere() {
        return this.filere;
    }

    public Etudiant filere(Filiere filere) {
        this.setFilere(filere);
        return this;
    }

    public void setFilere(Filiere filere) {
        this.filere = filere;
    }

    public LocalDate getEnrollmentDate() {
        return this.enrollmentDate;
    }

    public Etudiant enrollmentDate(LocalDate enrollmentDate) {
        this.setEnrollmentDate(enrollmentDate);
        return this;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Etudiant classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etudiant)) {
            return false;
        }
        return getId() != null && getId().equals(((Etudiant) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etudiant{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", apogee='" + getApogee() + "'" +
            ", niveau='" + getNiveau() + "'" +
            ", filere='" + getFilere() + "'" +
            ", enrollmentDate='" + getEnrollmentDate() + "'" +
            "}";
    }
}
