import chalk from 'chalk';
import { initRunner } from '../src/init-runner';
const templates = require ('./templates.json');

type SampleArgs = {
  initializers: string[];
  args: {
    appName: string;
    destination: string;
    fetchWith: string;
    prerender: string;
  }
}

function transformArgs(inputArgs: SampleArgs, sampleName: string, sampleInitializers: string[]): SampleArgs {
  let outputArgs: SampleArgs = {
    initializers: sampleInitializers,
    args: Object.assign({}, inputArgs.args)
  };
  outputArgs.args.appName = sampleName;
  outputArgs.args.destination = outputArgs.args.destination.replace(/\\\w+$/, `\\${sampleName}`);
  return outputArgs;
}

const nextjsPermutations:Record<string,string[]> = {
  "nextjs-vanilla":['nextjs'], 
  "nextjs-sxa":['nextjs', 'nextjs-sxa'], 
  "nextjs-personalize-styleguide":['nextjs', 'nextjs-styleguide', 'nextjs-personalize']
};
const samplesToInstall = ['nextjs', 'react', 'angular', 'vue'];

let samples = new Array<SampleArgs>();

//build samples info

for (const sample of samplesToInstall) {
  if (sample == 'nextjs') {
    for (const permutation in nextjsPermutations){
      samples.push(transformArgs(templates.nextjs, permutation, nextjsPermutations[permutation]));
    }
  } else {
    samples.push(transformArgs(templates.default, sample, [sample]));
  }
}


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

