/**
 * Este servidor sera usado como proxy, ya que todas nuestras llamadas van a ser llamadas del
 * API Server(Movie-API) y cuando hagamos el Sign In nos regresara el token que lo inyectaremos
 * en una cookie, para que todas nuestras demas rutas lean el token desde la cookie, con esta 
 * practica garantizamos que vamos a tener JSON Web Token protegido
 */
const express = require("express");

const { config } = require("./config");

const app = express();

// body parser
app.use(express.json());

app.post("/auth/sign-in", async function(req, res, next) {

});

app.post("/auth/sign-up", async function(req, res, next) {

});

app.get("/movies", async function(req, res, next) {

});

app.post("/user-movies", async function(req, res, next) {

});

app.delete("/user-movies/:userMovieId", async function(req, res, next) {

});

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});
