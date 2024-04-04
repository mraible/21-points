package org.jhipster.health.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PointsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Points getPointsSample1() {
        return new Points().id(1L).exercise(1).meals(1).alcohol(1).notes("notes1");
    }

    public static Points getPointsSample2() {
        return new Points().id(2L).exercise(2).meals(2).alcohol(2).notes("notes2");
    }

    public static Points getPointsRandomSampleGenerator() {
        return new Points()
            .id(longCount.incrementAndGet())
            .exercise(intCount.incrementAndGet())
            .meals(intCount.incrementAndGet())
            .alcohol(intCount.incrementAndGet())
            .notes(UUID.randomUUID().toString());
    }
}
