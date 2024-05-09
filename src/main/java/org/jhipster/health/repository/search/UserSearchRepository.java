package org.jhipster.health.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.stream.Stream;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.UserRepository;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data Elasticsearch repository for the User entity.
 */
public interface UserSearchRepository extends ElasticsearchRepository<User, Long>, UserSearchRepositoryInternal {}

interface UserSearchRepositoryInternal {
    Stream<User> search(String query);

    @Async
    @Transactional
    void index(User entity);

    @Async
    @Transactional
    void deleteFromIndex(User entity);
}

class UserSearchRepositoryInternalImpl implements UserSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final UserRepository repository;

    UserSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, UserRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<User> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return elasticsearchTemplate.search(nativeQuery, User.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(User entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndex(User entity) {
        elasticsearchTemplate.delete(entity);
    }
}
