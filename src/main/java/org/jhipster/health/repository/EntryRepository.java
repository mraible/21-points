package org.jhipster.health.repository;

import org.jhipster.health.domain.Entry;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Entry entity.
 */
public interface EntryRepository extends JpaRepository<Entry,Long> {

    @Query("select entry from Entry entry left join fetch entry.metrics where entry.id =:id")
    Entry findOneWithEagerRelationships(@Param("id") Long id);

}
