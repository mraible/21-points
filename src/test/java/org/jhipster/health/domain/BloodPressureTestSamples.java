package org.jhipster.health.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class BloodPressureTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static BloodPressure getBloodPressureSample1() {
        return new BloodPressure().id(1L).systolic(1).diastolic(1);
    }

    public static BloodPressure getBloodPressureSample2() {
        return new BloodPressure().id(2L).systolic(2).diastolic(2);
    }

    public static BloodPressure getBloodPressureRandomSampleGenerator() {
        return new BloodPressure()
            .id(longCount.incrementAndGet())
            .systolic(intCount.incrementAndGet())
            .diastolic(intCount.incrementAndGet());
    }
}
