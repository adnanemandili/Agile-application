package com.mycompany.agile.repository;

import com.mycompany.agile.domain.Etudiant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Etudiant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {}
