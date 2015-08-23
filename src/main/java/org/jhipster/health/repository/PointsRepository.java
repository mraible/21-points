package org.jhipster.health.repository;

import org.jhipster.health.domain.Points;
import org.joda.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data JPA repository for the Points entity.
 */
public interface PointsRepository extends JpaRepository<Points,Long> {

    @Query("select points from Points points where points.user.login = ?#{principal.username} order by points.date desc")
    Page<Points> findAllForCurrentUser(Pageable pageable);

    List<Points> findAllByDateBetween(LocalDate firstDate, LocalDate secondDate);

    Page<Points> findAllByOrderByDateDesc(Pageable pageable);
}
