/**
 * Este archivo sirve para crear nuestra estrategia de autenticación basica
 */

 // Nos sirve para realizar nuetsra autenticación
 const passport = require('passport');

 // Nos sirve para implentar la estrategia basica de autenticación
 const { BasicStrategy } = require('passport-http');

 //Manejo de errores
 const boom = require('@hapi/boom');

 // Esta libreria nos ayuda realzar request a otrso servidores, API Server
 const axios = require('axios');

 // variables de configuración
 const config = require('../../../config');

passport.use(
  new BasicStrategy(async function(email, password, cb) {
    try {
      // Axios Recibe un bjeto de configuración, donde estamos haciendoun request de sign-in
      // a nuestra API
      const { data , status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-in`,
        method: 'post',
        auth: {
          password,
          username: email
        },
        data: {
          apiKeyToken: config.apiKeyToken
        }
      });

      /**
       * Si responde y por alguna razon no tiene datos, es por eso que realizamos la siguiente
       * validacion 
       */
      if (!data || satus !== 200) {
        // mandamos un error y devolvemos que el usuario sea false
        return cb(boom.unauthorized(), false);
      }

      // Retornamos un eerro null y retornamos nuestros datos
      return cb(null, data);
    } catch (error) {
      cb(error);
    }
  })
)
