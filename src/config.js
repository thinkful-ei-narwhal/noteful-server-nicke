module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV === "production" ? "tiny" : "common",
  DB_URL: process.env.DB_URL || "postgresql://localhost/noteful",
  API_TOKEN: process.env.API_TOKEN,
};  