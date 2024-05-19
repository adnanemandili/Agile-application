package com.mycompany.agile.repository;

import com.mycompany.agile.domain.Matiere;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Matiere entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Long> {}
