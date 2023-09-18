const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { createGraphQLSchema } = require('openapi-to-graphql');
const request = require('request')
const yaml = require('js-yaml');
const port = process.env.PORT || 8080;
 
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
  app.listen(port)
}

request('https://api.adoptopenjdk.net/openapi', function (error, response, body) {
   // Print the response status code if a response was received
  console.log('statusCode:', response && response.statusCode);
  main(yaml.load(body))
}); 
