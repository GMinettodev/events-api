const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      description: 'Exemplo de API documentada com Swagger (OpenAPI)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // Arquivos onde vamos anotar os endpoints (podem ser rotas separadas)
  apis: ['./src/routes/*.js'],
};
// ../routes/*.js
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
