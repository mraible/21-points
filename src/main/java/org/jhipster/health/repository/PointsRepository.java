package org.jhipster.health.repository;

import org.jhipster.health.domain.Points;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Points entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsRepository extends JpaRepository<Points, Long> {

    @Query("select points from Points points where points.user.login = ?#{principal.username}")
    List<Points> findByUserIsCurrentUser();

}
