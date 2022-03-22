package org.jhipster.health.repository.search;

import java.util.ArrayList;
import java.util.List;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Sort;

public class SortToSortBuilderListConverter implements Converter<Sort, List<SortBuilder<?>>> {

    @Override
    public List<SortBuilder<?>> convert(Sort sort) {
        List<SortBuilder<?>> builders = new ArrayList<>();
        sort
            .stream()
            .forEach(order -> {
                String property = order.getProperty() + ".keyword";
                SortOrder sortOrder = SortOrder.fromString(order.getDirection().name());
                builders.add(new FieldSortBuilder(property).order(sortOrder));
            });
        return builders;
    }
}
