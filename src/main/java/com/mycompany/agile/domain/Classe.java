package com.mycompany.agile.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.agile.domain.enumeration.Filiere;
import com.mycompany.agile.domain.enumeration.Groupe;
import com.mycompany.agile.domain.enumeration.Niveau;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * L'entité Classe.
 */
@Schema(description = "L'entité Classe.")
@Entity
@Table(name = "classe")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Classe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "level")
    private String level;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_group")
    private Groupe group;

    @Enumerated(EnumType.STRING)
    @Column(name = "niveau")
    private Niveau niveau;

    @Enumerated(EnumType.STRING)
    @Column(name = "filere")
    private Filiere filere;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "classe")
    @JsonIgnoreProperties(value = { "classe" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "classes")
    @JsonIgnoreProperties(value = { "matieres", "classes" }, allowSetters = true)
    private Set<Professeur> professeurs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Classe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassName() {
        return this.className;
    }

    public Classe className(String className) {
        this.setClassName(className);
        return this;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getLevel() {
        return this.level;
    }

    public Classe level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Groupe getGroup() {
        return this.group;
    }

    public Classe group(Groupe group) {
        this.setGroup(group);
        return this;
    }

    public void setGroup(Groupe group) {
        this.group = group;
    }

    public Niveau getNiveau() {
        return this.niveau;
    }

    public Classe niveau(Niveau niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }

    public Filiere getFilere() {
        return this.filere;
    }

    public Classe filere(Filiere filere) {
        this.setFilere(filere);
        return this;
    }

    public void setFilere(Filiere filere) {
        this.filere = filere;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        if (this.etudiants != null) {
            this.etudiants.forEach(i -> i.setClasse(null));
        }
        if (etudiants != null) {
            etudiants.forEach(i -> i.setClasse(this));
        }
        this.etudiants = etudiants;
    }

    public Classe etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Classe addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        etudiant.setClasse(this);
        return this;
    }

    public Classe removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        etudiant.setClasse(null);
        return this;
    }

    public Set<Professeur> getProfesseurs() {
        return this.professeurs;
    }

    public void setProfesseurs(Set<Professeur> professeurs) {
        if (this.professeurs != null) {
            this.professeurs.forEach(i -> i.removeClasse(this));
        }
        if (professeurs != null) {
            professeurs.forEach(i -> i.addClasse(this));
        }
        this.professeurs = professeurs;
    }

    public Classe professeurs(Set<Professeur> professeurs) {
        this.setProfesseurs(professeurs);
        return this;
    }

    public Classe addProfesseur(Professeur professeur) {
        this.professeurs.add(professeur);
        professeur.getClasses().add(this);
        return this;
    }

    public Classe removeProfesseur(Professeur professeur) {
        this.professeurs.remove(professeur);
        professeur.getClasses().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Classe)) {
            return false;
        }
        return getId() != null && getId().equals(((Classe) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Classe{" +
            "id=" + getId() +
            ", className='" + getClassName() + "'" +
            ", level='" + getLevel() + "'" +
            ", group='" + getGroup() + "'" +
            ", niveau='" + getNiveau() + "'" +
            ", filere='" + getFilere() + "'" +
            "}";
    }
}
