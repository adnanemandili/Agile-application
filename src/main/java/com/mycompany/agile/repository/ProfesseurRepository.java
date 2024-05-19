package com.mycompany.agile.repository;

import com.mycompany.agile.domain.Professeur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Professeur entity.
 *
 * When extending this class, extend ProfesseurRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ProfesseurRepository extends ProfesseurRepositoryWithBagRelationships, JpaRepository<Professeur, Long> {
    default Optional<Professeur> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Professeur> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Professeur> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
