package org.jhipster.health.repository;

import java.util.List;
import java.util.Optional;
import org.jhipster.health.domain.Preferences;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Preferences entity.
 */
@Repository
public interface PreferencesRepository extends JpaRepository<Preferences, Long> {
    default Optional<Preferences> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Preferences> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Preferences> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct preferences from Preferences preferences left join fetch preferences.user",
        countQuery = "select count(distinct preferences) from Preferences preferences"
    )
    Page<Preferences> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct preferences from Preferences preferences left join fetch preferences.user")
    List<Preferences> findAllWithToOneRelationships();

    @Query("select preferences from Preferences preferences left join fetch preferences.user where preferences.id =:id")
    Optional<Preferences> findOneWithToOneRelationships(@Param("id") Long id);
}
