# @aautcq/svg-to-iconify

[![NPM version][npm-version-src]][npm-version-href]
[![NPM downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Converts SVG icons to Iconify JSON data, allowing the use of popular Nuxt modules such as [Nuxt Icon](https://nuxt.com/modules/icon) or [NuxtUI](https://nuxt.com/modules/ui).

## Installation

Using NPM or whatever your preferred package manager is

```bash
npm i -g @aautcq/svg-to-iconify
```

## Usage

```bash
svg-to-iconify
```

The `svg-to-iconify` command comes with the following options

| Option label | Description | Default value |
| ------------ | ----------- | ------------- |
| `-a`, `--author` | Icon set author field | `os.userInfo().username` |
| `-p`, `--prefix` | Icon set prefix | `'custom'` |
| `-s`, `--source` | Path to the folder hosting the SVG files | `'.'` (current folder) |
| `-o`, `--output` | Path to the output folder for the JSON file | Same as source |

A JSON file containing the new icon set will be created in the output directory.

## To do

- Unit tests

## License

[MIT License](https://github.com/aautcq/svg-to-iconify/blob/master/LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@aautcq/svg-to-iconify/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@aautcq/svg-to-iconify

[npm-downloads-src]: https://img.shields.io/npm/dm/@aautcq/svg-to-iconify.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@aautcq/svg-to-iconify

[license-src]: https://img.shields.io/github/license/aautcq/svg-to-iconify.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/aautcq/svg-to-iconify/blob/master/LICENSE
