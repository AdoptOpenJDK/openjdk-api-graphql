const { createGraphQLSchema } = require('openapi-to-graphql');
const { createServer } = require('node:http')
const { createYoga } = require('graphql-yoga')
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

  // Create a Yoga instance with a GraphQL schema.
  const yoga = createYoga({ schema })
  
  // Pass it into a server to hook into request handlers.
  const server = createServer(yoga)
 
 
  // Start the server and you're done!
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`)
  })
}

request('https://api.adoptopenjdk.net/openapi', function (error, response, body) {
   // Print the response status code if a response was received
  console.log('statusCode:', response && response.statusCode);
  main(yaml.load(body))
}); 
