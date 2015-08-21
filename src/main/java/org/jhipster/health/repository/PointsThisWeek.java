package org.jhipster.health.repository;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.jhipster.health.domain.util.CustomLocalDateSerializer;
import org.jhipster.health.domain.util.ISO8601LocalDateDeserializer;

import org.joda.time.LocalDate;

public class PointsThisWeek {
    private LocalDate week;
    private Integer count;

    public PointsThisWeek() {}

    public PointsThisWeek(LocalDate week, Integer count) {
        this.week = week;
        this.count = count;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
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
            "count=" + count +
            ", week=" + week +
            '}';
    }
}
