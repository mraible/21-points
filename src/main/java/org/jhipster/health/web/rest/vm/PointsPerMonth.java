package org.jhipster.health.web.rest.vm;

import java.time.YearMonth;
import java.util.List;
import org.jhipster.health.domain.Points;

public class PointsPerMonth {

    private YearMonth month;
    private List<Points> points;

    public PointsPerMonth(YearMonth yearWithMonth, List<Points> points) {
        this.month = yearWithMonth;
        this.points = points;
    }

    public YearMonth getMonth() {
        return month;
    }

    public void setMonth(YearMonth month) {
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
        return "PointsPerMonth{" + "month=" + month + ", points=" + points + '}';
    }
}
