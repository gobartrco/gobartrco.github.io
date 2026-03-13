module.exports = {
    apps: [
      {
        name: "bartr-site",
        script: "bundle",
        args: "exec jekyll serve",
        interpreter: "none",
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
  