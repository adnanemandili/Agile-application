package com.mycompany.agile.web.rest;

import com.mycompany.agile.domain.Classe;
import com.mycompany.agile.repository.ClasseRepository;
import com.mycompany.agile.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.agile.domain.Classe}.
 */
@RestController
@RequestMapping("/api/classes")
@Transactional
public class ClasseResource {

    private final Logger log = LoggerFactory.getLogger(ClasseResource.class);

    private static final String ENTITY_NAME = "classe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClasseRepository classeRepository;

    public ClasseResource(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    /**
     * {@code POST  /classes} : Create a new classe.
     *
     * @param classe the classe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classe, or with status {@code 400 (Bad Request)} if the classe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Classe> createClasse(@Valid @RequestBody Classe classe) throws URISyntaxException {
        log.debug("REST request to save Classe : {}", classe);
        if (classe.getId() != null) {
            throw new BadRequestAlertException("A new classe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        classe = classeRepository.save(classe);
        return ResponseEntity.created(new URI("/api/classes/" + classe.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, classe.getId().toString()))
            .body(classe);
    }

    /**
     * {@code PUT  /classes/:id} : Updates an existing classe.
     *
     * @param id the id of the classe to save.
     * @param classe the classe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classe,
     * or with status {@code 400 (Bad Request)} if the classe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Classe> updateClasse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Classe classe
    ) throws URISyntaxException {
        log.debug("REST request to update Classe : {}, {}", id, classe);
        if (classe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        classe = classeRepository.save(classe);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classe.getId().toString()))
            .body(classe);
    }

    /**
     * {@code PATCH  /classes/:id} : Partial updates given fields of an existing classe, field will ignore if it is null
     *
     * @param id the id of the classe to save.
     * @param classe the classe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classe,
     * or with status {@code 400 (Bad Request)} if the classe is not valid,
     * or with status {@code 404 (Not Found)} if the classe is not found,
     * or with status {@code 500 (Internal Server Error)} if the classe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Classe> partialUpdateClasse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Classe classe
    ) throws URISyntaxException {
        log.debug("REST request to partial update Classe partially : {}, {}", id, classe);
        if (classe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Classe> result = classeRepository
            .findById(classe.getId())
            .map(existingClasse -> {
                if (classe.getClassName() != null) {
                    existingClasse.setClassName(classe.getClassName());
                }
                if (classe.getLevel() != null) {
                    existingClasse.setLevel(classe.getLevel());
                }
                if (classe.getGroup() != null) {
                    existingClasse.setGroup(classe.getGroup());
                }
                if (classe.getNiveau() != null) {
                    existingClasse.setNiveau(classe.getNiveau());
                }
                if (classe.getFilere() != null) {
                    existingClasse.setFilere(classe.getFilere());
                }

                return existingClasse;
            })
            .map(classeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classe.getId().toString())
        );
    }

    /**
     * {@code GET  /classes} : get all the classes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classes in body.
     */
    @GetMapping("")
    public List<Classe> getAllClasses() {
        log.debug("REST request to get all Classes");
        return classeRepository.findAll();
    }

    /**
     * {@code GET  /classes/:id} : get the "id" classe.
     *
     * @param id the id of the classe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Classe> getClasse(@PathVariable("id") Long id) {
        log.debug("REST request to get Classe : {}", id);
        Optional<Classe> classe = classeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classe);
    }

    /**
     * {@code DELETE  /classes/:id} : delete the "id" classe.
     *
     * @param id the id of the classe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable("id") Long id) {
        log.debug("REST request to delete Classe : {}", id);
        classeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
