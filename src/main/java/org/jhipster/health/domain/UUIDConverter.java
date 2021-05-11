package org.jhipster.health.domain;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.UUID;

/**
 * JPA Convention to automatically convert UUID from Database (PostgreSQL) into Java and vice versa.
 */
@Converter(autoApply = true)
public class UUIDConverter implements AttributeConverter<UUID, UUID> {
    @Override
    public UUID convertToDatabaseColumn(UUID attribute) {
        return attribute;
    }
    @Override
    public UUID convertToEntityAttribute(UUID dbData) {
        return dbData;
    }
}
