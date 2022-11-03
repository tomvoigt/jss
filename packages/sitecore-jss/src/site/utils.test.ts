import { expect } from 'chai';
import {
    getMultiSiteRewrite,
    getMultiSiteRewriteData,
  normalizeMultiSiteRewrite,
  SITE_PREFIX,
  DEFAULT_SITE,
} from './utils';

describe('multi-site utils', () => {

    const cleanPath = 'everything/is/possible';
    const personalizedPath = `/_variantId_notpossible/`;
    const site = 'zombocom';
    const siteData = {
        siteName: site,
    };

    describe('getMultiSiteRewrite', () => {
        it('should retain personalize data in path when present', async () => {
            const result = getMultiSiteRewrite(personalizedPath, siteData)
            expect(result).to.equal(`/${SITE_PREFIX}${site}${personalizedPath}`);
        });
        it('should return the path with the site name when path starts with "/"', () => {
            const cleanPathWithSlash = `/${cleanPath}`;
            const result = getMultiSiteRewrite(cleanPathWithSlash, siteData)
            expect(result).to.equal(`/${SITE_PREFIX}${site}${cleanPathWithSlash}`);
          });
          it('should return the path with the site name when pathname not starts with "/"', () => {
            const result = getMultiSiteRewrite(cleanPath, siteData)
            expect(result).to.equal(`/${SITE_PREFIX}${site}/${cleanPath}`);
          });
          it('should return the root path with the site name', () => {
            const rootPath = '/';
            const result = getMultiSiteRewrite(rootPath, siteData)
            expect(result).to.equal(`/${SITE_PREFIX}${site}/`);
          });

    });
    
    describe('getMultiSiteRewriteData', () => {
          it('should return the site name data from the rewrite path', () => {
            const pathWithSite = `/${SITE_PREFIX}${site}/${cleanPath}`;
            const result = getMultiSiteRewriteData(pathWithSite)
            expect(result).to.deep.equal(siteData);
          });
          it('should return the default site name when pathname does not contain site data', () => {
            const result = getMultiSiteRewriteData(cleanPath)
            expect(result).to.deep.equal({
                siteName: DEFAULT_SITE,
            });
          });
          it('should return default site name when pathname is missing site name', () => {
            const pathWithMissingSite = `/${SITE_PREFIX}/${cleanPath}`;
            const result = getMultiSiteRewriteData(pathWithMissingSite)
            expect(result).to.deep.equal({
                siteName: DEFAULT_SITE,
            });
          });
    });

    describe('normalizeMultiSiteRewrite', () => {
          it('should return the pathname when it does not contain site name', () => {
            const path = `/${cleanPath}`;
            const result = normalizeMultiSiteRewrite(path);
            expect(result).to.equal(path);
          });
          it('should return the pathname without the site name', () => {
            const pathWithSiteData = `/${SITE_PREFIX}${site}/${cleanPath}/`;
            const result = normalizeMultiSiteRewrite(pathWithSiteData);
            expect(result).to.equal(`/${cleanPath}/`);
          });  
          it('should return the root pathname without the site name', () => {
            const rootPathWithSiteData = `/${SITE_PREFIX}${site}/`;
            const result = normalizeMultiSiteRewrite(rootPathWithSiteData);
            expect(result).to.equal('/');
          });
          it('should return the root pathname without the site name when pathname not ends with "/"', () => {
            const pathWithSiteDataNoSlash = `/${SITE_PREFIX}insite`;
            const result = normalizeMultiSiteRewrite(pathWithSiteDataNoSlash);
            expect(result).to.equal('/');
          });
    });
})