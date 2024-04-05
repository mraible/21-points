package org.jhipster.health.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class WeightTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Weight getWeightSample1() {
        return new Weight().id(1L);
    }

    public static Weight getWeightSample2() {
        return new Weight().id(2L);
    }

    public static Weight getWeightRandomSampleGenerator() {
        return new Weight().id(longCount.incrementAndGet());
    }
}
