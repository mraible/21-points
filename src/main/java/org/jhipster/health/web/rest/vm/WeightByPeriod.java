package org.jhipster.health.web.rest.vm;

import org.jhipster.health.domain.Weight;

import java.util.List;

public class WeightByPeriod {
    private String period;
    private List<Weight> weighIns;

    public WeightByPeriod(String period, List<Weight> weighIns) {
        this.period = period;
        this.weighIns = weighIns;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<Weight> getWeighIns() {
        return weighIns;
    }

    public void setWeighIns(List<Weight> weighIns) {
        this.weighIns = weighIns;
    }

    @Override
    public String toString() {
        return "WeightByPeriod{" +
            "period='" + period + '\'' +
            ", weighIns=" + weighIns +
            '}';
    }
}

