"use strict";

const Bell = require('@hapi/bell');
const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register(Bell);

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: 'cookie_encryption_password_secure',
    // TODO:bad idea but there is no choice until you get https
    isSecure: false,
    clientId: '202098150382-mpucfvjad5tt9p1o964v4nrd38ka8fde.apps.googleusercontent.com',
    clientSecret: '6qYNSFv2SMKx-Ptre6WnUtRl',
    location: server.info.uri
  });

  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    handler: (request, h) => {
      if(!request.auth.isAuthenticated)
        return 'Authentication Failed duo to: ' + request.auth.error.message;
      return '<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>';
    },
    options: {
      auth: {
        strategy: 'google',
        mode: 'try'
      }
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();