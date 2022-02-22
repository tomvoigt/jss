import config from 'temp/config';

import { RenderRobotsMiddleware } from '../lib/robots-lib';

const configMiddleware = {
  graphQLEndpoint: config.graphQLEndpoint,
  sitecoreApiKey: config.sitecoreApiKey,
  siteName: config.jssAppName
};

// Wire up the EditingRenderMiddleware handler 
const handler = new RenderRobotsMiddleware(configMiddleware).getHandler();


export default handler;
