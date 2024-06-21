#! /usr/bin/env node
import os from 'node:os'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { generateIconSet } from '../index.js'

const { a, p, s, o } = await yargs(hideBin(process.argv))
  .usage('Create Iconify icon sets from SVG files\n\nUsage: svg-to-iconify -a <author> -p <prefix> -s <source> -o <output>\n')
  .option('a', {
    alias: 'author',
    describe: 'Icon set author',
    type: 'string',
    demandOption: false,
    default: os.userInfo().username,
  })
  .option('p', {
    alias: 'prefix',
    describe: 'Icon set prefix',
    type: 'string',
    demandOption: false,
    default: 'custom',
  })
  .option('s', {
    alias: 'source',
    describe: 'Path to the folder hosting the SVG files',
    type: 'string',
    demandOption: false,
    default: '.',
  })
  .option('o', {
    alias: 'output',
    describe: 'Path to the output folder for the JSON file',
    type: 'string',
    demandOption: false,
    default: undefined,
  })
  .help(true)
  .argv

console.info(chalk.white('Generating icon set...'))

try {
  await generateIconSet(a, p, s, { outputDir: o ?? s })
  process.exit(0)
}
catch (e) {
  console.error(chalk.red('An error occurred while generating the icon set:'), e)
  process.exit(1)
}
