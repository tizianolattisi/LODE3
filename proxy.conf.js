const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/storage"
    ],
    target: "http://localhost:8080",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
