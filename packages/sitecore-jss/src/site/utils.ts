export const DEFAULT_SITE = 'website'; //TODO: read from config/use app name
export const SITE_PREFIX = '_siteName_';

export type MultiSiteRewriteData = {
    siteName: string;
};

/**
 * Get a rewrite path to load the correct site after multi-site resolving
 * @param {string} pathname the pathname
 * @param {SiteNameRewriteData} data the site data to include in the rewrite
 * @returns {string} the rewrite path
 */
export function getMultiSiteRewrite(pathname: string, data: MultiSiteRewriteData): string {
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;
  return `/${SITE_PREFIX}${data.siteName}${path}`;
}

/**
 * Get site name data from the rewrite path
 * @param {string} pathname the pathname
 * @returns {MultiSiteRewriteData} the personalize data from the rewrite
 */
export function getMultiSiteRewriteData(pathname: string): MultiSiteRewriteData {
  const data: MultiSiteRewriteData = {
    siteName: DEFAULT_SITE,
  };
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  const result = path.match(`${SITE_PREFIX}(.*?)\\/`);
  if (result && result[1] != '') {
    data.siteName = result[1];
  }
  return data;
}

/**
 * Normalize a previously modified rewrite path (remove site name data)
 * @param {string} pathname the pathname
 * @returns {string} the pathname with site name data removed
 */
export function normalizeMultiSiteRewrite(pathname: string): string {
  if (!pathname.includes(SITE_PREFIX)) {
    return pathname;
  }
  const result = pathname.match(`${SITE_PREFIX}.*?(?:\\/|$)`);
  return result === null ? pathname : pathname.replace(result[0], '');
}