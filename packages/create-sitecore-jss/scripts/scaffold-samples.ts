import chalk from 'chalk';
import { initRunner } from '../src/init-runner';
import samples from './samples.json';

for (const sample of samples) {
  console.log(chalk.green(`Initializing sample ${sample.args.appName} ...`));
  initRunner(sample.initializers, {
    ...sample.args,
    templates: sample.initializers,
    yes: true,
    force: true,
    silent: true,
    noInstall: true,
  });
}
