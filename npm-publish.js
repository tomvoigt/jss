const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// execSync('git fetch --all --tags -f', { stdio: 'inherit' });

const isYarnInstalled = execSync('yarn --help', {
  encoding: 'utf-8',
}).includes('yarn <command>');

if (isYarnInstalled) {
  console.log('Yarn is installed');
} else {
  execSync('npm i -g yarn', { stdio: 'inherit' });
}

const packages = fs.readdirSync('./packages');

const access = JSON.parse(execSync('npm access ls-packages', { encoding: 'utf-8' }));

packages.forEach((pkg) => {
  const key = Object.keys(access).find((pgkKey) => pgkKey.includes(pkg));

  const hasAccess = access[key] === 'read-write';

  if (hasAccess) {
    console.log('Has access to', key);
  } else {
    console.log('Dont have access to', key);
  }
});

execSync('git clone https://github.com/Sitecore/jss.git', { stdio: 'inherit' });
execSync('cd ./jss', { stdio: 'inherit' });
execSync('git checkout master', { stdio: 'inherit' });
execSync('yarn install', { stdio: 'inherit' });
execSync('yarn reset', { stdio: 'inherit' });

// !!! CHECK
// Update all doc links to the latest version
// This should be limited to the README.md files
// In VSCode, you can generally do a find and replace for "/<prev_version>/sitecore-headless-development" with "/<version>/sitecore-headless-development" e.g. "/190/sitecore-headless-development" with "/200/sitecore-headless-development". However, each README file should be checked as the topic names may have changed as well as there may be a difference on XP (https://doc.sitecore.com/xp) vs XMC (https://doc.sitecore.com/xmc)

execSync('yarn generate-docs', { stdio: 'inherit' });

execSync(
  'npx lerna version --conventional-graduate --force-publish --no-push --no-git-tag-version',
  { stdio: 'inherit' }
);

const canaryVersion = JSON.parse(fs.readFileSync('./lerna.json')).version;

fs.readdirSync('./packages/create-sitecore-jss/templates').forEach(template => {
	const packageJson = fs.readFileSync()
});

// console.log(packages);
