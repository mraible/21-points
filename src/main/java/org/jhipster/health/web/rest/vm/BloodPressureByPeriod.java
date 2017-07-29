package org.jhipster.health.web.rest.vm;

import org.jhipster.health.domain.BloodPressure;

import java.util.List;

public class BloodPressureByPeriod {
    private String period;
    private List<BloodPressure> readings;

    public BloodPressureByPeriod(String period, List<BloodPressure> readings) {
        this.period = period;
        this.readings = readings;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<BloodPressure> getReadings() {
        return readings;
    }

    public void setReadings(List<BloodPressure> readings) {
        this.readings = readings;
    }

    @Override
    public String toString() {
        return "BloodPressureByPeriod{" +
            "period='" + period + '\'' +
            ", readings=" + readings +
            '}';
    }
}

