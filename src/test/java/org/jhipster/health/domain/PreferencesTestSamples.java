package org.jhipster.health.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PreferencesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Preferences getPreferencesSample1() {
        return new Preferences().id(1L).weeklyGoal(1);
    }

    public static Preferences getPreferencesSample2() {
        return new Preferences().id(2L).weeklyGoal(2);
    }

    public static Preferences getPreferencesRandomSampleGenerator() {
        return new Preferences().id(longCount.incrementAndGet()).weeklyGoal(intCount.incrementAndGet());
    }
}
