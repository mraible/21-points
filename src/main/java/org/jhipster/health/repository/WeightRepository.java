package org.jhipster.health.repository;

import org.jhipster.health.domain.Weight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for the Weight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeightRepository extends JpaRepository<Weight,Long> {

    @Query("select weight from Weight weight where weight.user.login = ?#{principal.username} order by weight.timestamp desc")
    Page<Weight> findByUserIsCurrentUser(Pageable pageable);

    Page<Weight> findAllByOrderByTimestampDesc(Pageable pageable);

    List<Weight> findAllByTimestampBetweenOrderByTimestampDesc(ZonedDateTime firstDate, ZonedDateTime secondDate);
}
