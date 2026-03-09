module.exports = {
    apps: [
      {
        name: "bartr-site",
        script: "bundle",
        args: "exec jekyll serve",
        interpreter: "none",
        // exec_mode: "fork",
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
  