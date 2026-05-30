module.exports = {
    apps: [
      {
        name: "bartr-site",
        script: "caddy",
        args:
          "run --config ./Caddyfile",
        exec_mode: "fork",
      },
    ],
  };
  