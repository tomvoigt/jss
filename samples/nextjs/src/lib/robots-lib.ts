import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss';
import { NextRequest } from 'next/server';

const robotsPattern = 'robots.txt';

/**
 * Scheme response of robots.txt
 */
export type RobotsMiddlewareResponse = {
  data: {
    data: {
      site: {
        siteInfo: {
          robots: string;
        };
      };
    };
  };
};

export interface RobotsMiddlewareConfig {
  graphQLEndpoint: string;
  sitecoreApiKey: string;
  siteName: string;
}

export class RenderRobotsMiddleware {
  constructor(private config: RobotsMiddlewareConfig) {}

  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: NextRequest) => Promise<Response | void> {
    return this.handler;
  }

  private handler = async (req: NextRequest): Promise<Response | void> => {
    const { url } = req;

    if (url === this.getRobotsUrl(req)) {
      const robotsResult = await this.getResultGraphQLClient();
      return new Response(robotsResult, {
        status: 200,
        headers: {
          'content-type': 'text/plain',
          'content-encoding': 'gzip',
        },
      });
    }
  };

  private getRobotsUrl(req: NextRequest) {
    const { headers } = req;
    return `${process.env.VERCEL ? 'https' : 'http'}://${headers.get('host')}/${robotsPattern}`;
  }

  private async getResultGraphQLClient(): Promise<string> {
    const graphQLClient = new GraphQLRequestClient(this.config.graphQLEndpoint, {
      apiKey: this.config.sitecoreApiKey,
    });
    const query = `{
        site {
          siteInfo(site: "${this.config.siteName}") {
            robots
          }
        }
      }`;
    const result = graphQLClient.request(query);

    return await result.then((res: any) => res?.data?.site?.siteInfo?.robots);
  }
}
