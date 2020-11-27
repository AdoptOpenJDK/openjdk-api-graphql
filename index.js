const express = require('express')
const graphqlHTTP = require('express-graphql')
const { createGraphQLSchema } = require('openapi-to-graphql');
const request = require('request')
const yaml = require('js-yaml');
 
async function main(oas) {
  // generate schema:
  const { schema, report } = await createGraphQLSchema(oas, {
    headers: {
      'User-Agent': 'AdoptOpenJDK GraphQL Server'
    }
  })
 
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
  // workaround for https://github.com/IBM/openapi-to-graphql/issues/350
  body = body.replace(/default: "(.*?)"/g, "default: $1")
  main(yaml.safeLoad(body))
}); 