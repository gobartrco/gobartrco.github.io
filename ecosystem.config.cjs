module.exports = {
    apps: [
      {
        name: "bartr-website",
        script: "bundle exec jekyll serve --livereload",
        exec_mode: "fork",
        env_local: {
          ENABLED: "true",
        },
        env_development: {
          ENABLED: "false",
        },
        env_production: {
          ENABLED: "false",
        },
      }
    ],
  };
  