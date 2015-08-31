package org.jhipster.health.web.rest.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.jhipster.health.domain.Points;
import org.jhipster.health.domain.util.CustomLocalDateSerializer;
import org.jhipster.health.domain.util.ISO8601LocalDateDeserializer;
import org.joda.time.LocalDate;

import java.util.List;

public class PointsPerMonth {
    private LocalDate month;
    private List<Points> points;

    public PointsPerMonth(LocalDate yearWithMonth, List<Points> points) {
        this.month = yearWithMonth;
        this.points = points;
    }

    @JsonSerialize(using = CustomLocalDateSerializer.class)
    @JsonDeserialize(using = ISO8601LocalDateDeserializer.class)
    public LocalDate getMonth() {
        return month;
    }

    public void setMonth(LocalDate month) {
        this.month = month;
    }

    public List<Points> getPoints() {
        return points;
    }

    public void setPoints(List<Points> points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "PointsPerMonth{" +
            "month=" + month +
            ", points=" + points +
            '}';
    }
}
