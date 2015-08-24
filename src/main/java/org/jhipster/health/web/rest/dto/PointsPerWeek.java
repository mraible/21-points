package org.jhipster.health.web.rest.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.jhipster.health.domain.util.CustomLocalDateSerializer;
import org.jhipster.health.domain.util.ISO8601LocalDateDeserializer;

import org.joda.time.LocalDate;

public class PointsPerWeek {
    private LocalDate week;
    private Integer points;

    public PointsPerWeek() {}

    public PointsPerWeek(LocalDate week, Integer points) {
        this.week = week;
        this.points = points;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    @JsonSerialize(using = CustomLocalDateSerializer.class)
    @JsonDeserialize(using = ISO8601LocalDateDeserializer.class)
    public LocalDate getWeek() {
        return week;
    }

    public void setWeek(LocalDate week) {
        this.week = week;
    }

    @Override
    public String toString() {
        return "PointsThisWeek{" +
            "points=" + points +
            ", week=" + week +
            '}';
    }
}
