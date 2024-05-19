package com.mycompany.agile.repository;

import com.mycompany.agile.domain.Professeur;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProfesseurRepositoryWithBagRelationshipsImpl implements ProfesseurRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String PROFESSEURS_PARAMETER = "professeurs";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Professeur> fetchBagRelationships(Optional<Professeur> professeur) {
        return professeur.map(this::fetchClasses);
    }

    @Override
    public Page<Professeur> fetchBagRelationships(Page<Professeur> professeurs) {
        return new PageImpl<>(fetchBagRelationships(professeurs.getContent()), professeurs.getPageable(), professeurs.getTotalElements());
    }

    @Override
    public List<Professeur> fetchBagRelationships(List<Professeur> professeurs) {
        return Optional.of(professeurs).map(this::fetchClasses).orElse(Collections.emptyList());
    }

    Professeur fetchClasses(Professeur result) {
        return entityManager
            .createQuery(
                "select professeur from Professeur professeur left join fetch professeur.classes where professeur.id = :id",
                Professeur.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Professeur> fetchClasses(List<Professeur> professeurs) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, professeurs.size()).forEach(index -> order.put(professeurs.get(index).getId(), index));
        List<Professeur> result = entityManager
            .createQuery(
                "select professeur from Professeur professeur left join fetch professeur.classes where professeur in :professeurs",
                Professeur.class
            )
            .setParameter(PROFESSEURS_PARAMETER, professeurs)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
