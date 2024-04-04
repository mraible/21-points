package org.jhipster.health.web.rest.errors;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.ErrorCause;
import java.util.List;
import org.springframework.data.elasticsearch.UncategorizedElasticsearchException;

public class ElasticsearchExceptionMapper {

    private ElasticsearchExceptionMapper() {}

    public static RuntimeException mapException(RuntimeException originalException) {
        RuntimeException e = originalException;
        if (e.getCause() instanceof UncategorizedElasticsearchException) {
            e = (UncategorizedElasticsearchException) e.getCause();
        }
        if (e.getCause() instanceof ElasticsearchException) {
            ElasticsearchException esException = (ElasticsearchException) e.getCause();
            List<ErrorCause> rootCause = esException.response().error().rootCause();
            if (!rootCause.isEmpty()) {
                String reason = rootCause.get(0).reason();
                if (reason != null && reason.startsWith("Failed to parse query [")) {
                    return new QuerySyntaxException();
                }
            }
        }

        return originalException;
    }
}
