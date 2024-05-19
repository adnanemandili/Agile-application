package com.mycompany.agile.repository;

import com.mycompany.agile.domain.Professeur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ProfesseurRepositoryWithBagRelationships {
    Optional<Professeur> fetchBagRelationships(Optional<Professeur> professeur);

    List<Professeur> fetchBagRelationships(List<Professeur> professeurs);

    Page<Professeur> fetchBagRelationships(Page<Professeur> professeurs);
}
