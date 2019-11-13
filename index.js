/**
 * Este servidor sera usado como proxy, ya que todas nuestras llamadas van a ser llamadas del
 * API Server(Movie-API) y cuando hagamos el Sign In nos regresara el token que lo inyectaremos
 * en una cookie, para que todas nuestras demas rutas lean el token desde la cookie, con esta 
 * practica garantizamos que vamos a tener JSON Web Token protegido
 */
// para crear nuestro servidor http que nos servira de proxxy
const express = require("express");

// para validar nuestra autenticacion
const passport = require('passport');

// Boom para manejar nuestros errores
const boom = require('@hapi/boom');

//
const cookieParser = require('cookie-parser');

// Esta libreria nos ayuda realzar request a otrso servidores, API Server
const axios = require('axios');

const { config } = require("./config");

const app = express();

// body parser
app.use(express.json());

app.use(cookieParser());

// Basic Strategy
require('./utils/auth/strategies/basic');

app.post("/auth/sign-in", async function(req, res, next) {
  passport.authenticate('basic', function(error, data) {
    try {
      // Validación de que si por alguna razon fallo algo mandamos al siguientes
      // middleware  un error de boom
      if(error || !data) {
        next(boom.unauthorized());
      }

      // En caso de salir bien
      req.login(data, { session: false }, async function(error){
        if (error) {
          next(error);
        }

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev
        });

        res.status(200).json(user);
      })
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async function(req, res, next) {
  const { body: user } = req;

  try {
    await axios({
      url: `${config.apiUrl}/api/auth/sugn-up`,
      method: 'post',
      data: user
    });

    res.status(201).json({ message: "user created" });
  } catch (error) {
    next(error);
  }
});

app.get("/movies", async function(req, res, next) {

});

app.post("/user-movies", async function(req, res, next) {
  // Como vamos a usar un metodo asicrono hacemos uso del try-catch
  try {
    const {body: userMovie } = req;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: userMovie
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete("/user-movies/:userMovieId", async function(req, res, next) {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete'
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(20).json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});
