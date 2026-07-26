export function mapRepository(repository, config) {
  return {
    id: repository.id,

    name: repository.name,

    fullName: repository.full_name,

    description: repository.description,

    stars: repository.stargazers_count,

    forks: repository.forks_count,

    watchers: repository.watchers_count,

    language: repository.language,

    topics: repository.topics,

    homepage: config.live || repository.homepage,

    repository: repository.html_url,

    updated: repository.updated_at,

    featured: config.featured,

    homepageFeatured: config.homepage,

    order: config.order,
  };
}
