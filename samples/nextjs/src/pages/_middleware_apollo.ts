import config from 'temp/config';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";
import { NextRequest } from 'next/server';

// import { RenderRobotsMiddleware } from '../lib/robots-lib';

const configMiddleware = {
  graphQLEndpoint: config.graphQLEndpoint,
  sitecoreApiKey: config.sitecoreApiKey,
  siteName: config.jssAppName
};

// Wire up the EditingRenderMiddleware handler 
// const handler = new RenderRobotsMiddleware(configMiddleware).getHandler();

const handler = async function middleware(req: NextRequest) {
  const { url, headers } = req;
  if (url === `http://${headers.get('host')}/robots.txt`) {
    const result = await getRobotsByGraphQL();
    return new Response(result.data.site.siteInfo.robots, {
      status: 200,
      headers: {
        'content-type': 'text/plain',
        'content-encoding': 'gzip',
      }
    });
  }
}

export default handler;

async function getRobotsByGraphQL() {
  const client = new ApolloClient({
    uri: `${configMiddleware.graphQLEndpoint}?sc_apikey=${configMiddleware.sitecoreApiKey}`,
    cache: new InMemoryCache()
  });

  return await client
  .query({
    query: gql`{
      site {
        siteInfo(site: "${configMiddleware.siteName}") {
          robots
        }
      }
    }`
  })
  .then(result => result);
}