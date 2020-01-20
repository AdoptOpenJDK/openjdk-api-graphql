const express = require('express')
const graphqlHTTP = require('express-graphql')
const { createGraphQlSchema } = require('openapi-to-graphql');
const request = require('request')
const fs = require('fs');

const yaml = require('js-yaml');
 
async function main(oas) {
  // generate schema:
  const { schema, report } = await createGraphQlSchema(oas)
 
  // server schema:
  const app = express()
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  )
  app.listen(8080)
}

request('https://api.adoptopenjdk.net/openapi', function (error, response, body) {
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  main(yaml.safeLoad(body))
});