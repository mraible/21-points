package org.jhipster.health.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.jhipster.health.domain.util.CustomDateTimeDeserializer;
import org.jhipster.health.domain.util.CustomDateTimeSerializer;
import org.joda.time.DateTime;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;


/**
 * A BloodPressure.
 */
@Entity
@Table(name = "BLOODPRESSURE")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName="bloodpressure")
public class BloodPressure implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    @JsonSerialize(using = CustomDateTimeSerializer.class)
    @JsonDeserialize(using = CustomDateTimeDeserializer.class)
    @Column(name = "timestamp", nullable = false)
    private DateTime timestamp;

    @NotNull
    @Column(name = "systolic", nullable = false)
    private Integer systolic;

    @NotNull
    @Column(name = "diastolic", nullable = false)
    private Integer diastolic;

    @ManyToOne
    private User user;

    public BloodPressure() {}

    public BloodPressure(DateTime dateTime, Integer systolic, Integer diastolic, User user) {
        this.timestamp = dateTime;
        this.systolic = systolic;
        this.diastolic = diastolic;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(DateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getSystolic() {
        return systolic;
    }

    public void setSystolic(Integer systolic) {
        this.systolic = systolic;
    }

    public Integer getDiastolic() {
        return diastolic;
    }

    public void setDiastolic(Integer diastolic) {
        this.diastolic = diastolic;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        BloodPressure bloodPressure = (BloodPressure) o;

        if ( ! Objects.equals(id, bloodPressure.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "BloodPressure{" +
                "id=" + id +
                ", timestamp='" + timestamp + "'" +
                ", systolic='" + systolic + "'" +
                ", diastolic='" + diastolic + "'" +
                '}';
    }
}
