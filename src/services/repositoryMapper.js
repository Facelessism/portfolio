export function mapRepository(
  repository,
  config
) {
  return {
    id: repository.id,

    name:
      repository.name,

    fullName:
      repository.full_name,

    description:
      repository.description ||
      "No description provided.",


    stars:
      repository.stargazers_count ?? 0,

    forks:
      repository.forks_count ?? 0,

    watchers:
      repository.watchers_count ?? 0,


    language:
      repository.language ||
      "Unknown",


    topics:
      repository.topics ?? [],


    urls: {
      repository:
        repository.html_url,

      homepage:
        config.live ||
        repository.homepage ||
        null,
    },


    updated:
      repository.updated_at,


    featured:
      Boolean(config.featured),

    homepageFeatured:
      Boolean(config.homepage),

    order:
      config.order ?? 999,
  };
}
