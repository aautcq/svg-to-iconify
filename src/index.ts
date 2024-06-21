import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'pathe'
import chalk from 'chalk'
import type { SVG } from '@iconify/tools'
import {
  IconSet,
  cleanupSVG,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
} from '@iconify/tools'

// Export to IconifyJSON, convert to string
export function iconSetToJson(iconSet: IconSet) {
  return JSON.stringify(iconSet.export(), null, '  ')
}

export interface SaveIconSetOptions {
  enableLogs?: boolean
  outputFilename?: string
  outputDir?: string
}

export function saveIconSet(iconSet: IconSet, options?: SaveIconSetOptions) {
  const output = iconSetToJson(iconSet)

  // Create output directory
  try {
    mkdirSync(`./${options?.outputDir ?? 'dist'}`, { recursive: true })
  }
  catch (e) {
    //
  }

  // Save to file
  const target = `./${options?.outputDir ?? 'dist'}/${options?.outputFilename ?? iconSet.prefix}.json`
  writeFileSync(target, output, 'utf8')

  if (options?.enableLogs ?? true) {
    console.info(
      `${chalk.green(`Saved ${chalk.bold(iconSet.count())} icons to ${target}`)} ${chalk.dim(`(${output.length} bytes)`)}`,
    )
  }

  return {
    nbIcons: iconSet.count(),
    target,
    size: output.length,
  }
}

export function cleanUpIconifySVG(svg: SVG) {
  // cleanupSVG from @iconify/tools shoots warnings, suppress them ლ(ಠ益ಠლ)
  const consoleWarn = console.warn
  console.warn = () => {}

  // Clean up icon code
  cleanupSVG(svg)

  // Replace color with currentColor, add if missing
  parseColors(svg, {
    defaultColor: 'currentColor',
    callback: (_, colorStr, color) => {
      return !color || isEmptyColor(color) ? colorStr : 'currentColor'
    },
  })

  // Optimise
  runSVGO(svg)

  // Restore console.warn
  console.warn = consoleWarn

  return svg
}

export interface GenerateSetOptions {
  icons?: string[]
  outputFilename?: string
  outputDir?: string
}

export async function generateIconSet(
  author: string,
  prefix: string,
  source: string,
  options?: GenerateSetOptions,
) {
  // Import icons
  const iconSet = await importDirectory(source, { prefix })

  // Set info
  iconSet.info = JSON.parse(JSON.stringify({
    name: author,
    author: { name: author },
    height: 32,
  }))

  // Validate, clean up, fix palette and optimise
  iconSet.forEachSync((iconName, type) => {
    if (type !== 'icon') return

    if (
      options?.icons
      && options?.icons?.length > 0
      && !options?.icons?.includes(iconName)
    ) {
      iconSet.remove(iconName)
      return
    }

    // Get SVG instance for parsing
    const svg = iconSet.toSVG(iconName)
    if (!svg) {
      // Invalid icon
      iconSet.remove(iconName)
      return
    }

    // Clean up and optimise icons
    try {
      cleanUpIconifySVG(svg)
    }
    catch (e) {
      // Invalid icon
      console.error(chalk.red(`Error parsing ${iconName}:`), e)
      iconSet.remove(iconName)
      return
    }

    // Update icon from SVG instance
    iconSet.fromSVG(iconName, svg)
  })

  saveIconSet(
    iconSet,
    { outputFilename: options?.outputFilename, outputDir: options?.outputDir },
  )

  return iconSet
}

export interface GenerateSetsOptions {
  sets?: string[]
  outputDir?: string
  enableLogs?: boolean
}

export function getIconSubSet(name: string, icons: string[]) {
  // Read data, parse JSON
  const rawData = JSON.parse(readFileSync(path.join(__dirname, `${name}.json`), 'utf8'))

  // Create new IconSet instance
  const iconSet = new IconSet(rawData)

  iconSet.forEachSync((iconName, type) => {
    if (type !== 'icon') return
    if (!icons.includes(iconName)) {
      iconSet.remove(iconName)
    }
  })

  return iconSet
}
