package org.jhipster.health.repository;

import org.jhipster.health.domain.Weight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Spring Data JPA repository for the Weight entity.
 */
public interface WeightRepository extends JpaRepository<Weight,Long> {

    @Query("select weight from Weight weight where weight.user.login = ?#{principal.username} order by weight.timestamp desc")
    Page<Weight> findAllForCurrentUser(Pageable pageable);

    Page<Weight> findAllByOrderByTimestampDesc(Pageable pageable);
}
