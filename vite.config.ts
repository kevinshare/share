import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getSongPageMetadata, songs } from './src/data/songs'

type FileSystemModule = {
  mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>
  readFile: (path: string, encoding: 'utf8') => Promise<string>
  writeFile: (path: string, data: string) => Promise<void>
}

const loadFileSystem = () =>
  Function('return import("node:fs/promises")')() as Promise<FileSystemModule>

const joinPath = (...segments: string[]) =>
  segments
    .filter(Boolean)
    .map((segment, index) => {
      if (index === 0) {
        return segment.replace(/\/+$/, '')
      }

      return segment.replace(/^\/+|\/+$/g, '')
    })
    .join('/')

const resolveOutDir = (root: string, outDir: string) =>
  outDir.startsWith('/') ? outDir : joinPath(root, outDir)

const escapeHtml = (value: string | number) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const replaceTagContent = (html: string, pattern: RegExp, replacement: string) => {
  if (!pattern.test(html)) {
    return html
  }

  return html.replace(pattern, () => replacement)
}

const applyPageMetadata = (
  html: string,
  metadata: {
    title: string
    description: string
    canonicalUrl: string
    imageUrl: string
    imageWidth: number
    imageHeight: number
    imageAlt: string
  },
) => {
  let output = html
  const title = escapeHtml(metadata.title)
  const description = escapeHtml(metadata.description)
  const canonicalUrl = escapeHtml(metadata.canonicalUrl)
  const imageUrl = escapeHtml(metadata.imageUrl)
  const imageWidth = escapeHtml(metadata.imageWidth)
  const imageHeight = escapeHtml(metadata.imageHeight)
  const imageAlt = escapeHtml(metadata.imageAlt)

  output = replaceTagContent(output, /<title>.*?<\/title>/s, `<title>${title}</title>`)
  output = replaceTagContent(output, /<meta\s+name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`)
  output = replaceTagContent(output, /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/, `<meta property="og:description" content="${description}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonicalUrl}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/, `<meta property="og:image" content="${imageUrl}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/, `<meta property="og:image:secure_url" content="${imageUrl}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:image:width"\s+content=".*?"\s*\/?>/, `<meta property="og:image:width" content="${imageWidth}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/, `<meta property="og:image:height" content="${imageHeight}" />`)
  output = replaceTagContent(output, /<meta\s+property="og:image:alt"\s+content=".*?"\s*\/?>/, `<meta property="og:image:alt" content="${imageAlt}" />`)
  output = replaceTagContent(output, /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`)
  output = replaceTagContent(output, /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${description}" />`)
  output = replaceTagContent(output, /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${imageUrl}" />`)
  output = replaceTagContent(output, /<meta\s+name="twitter:image:alt"\s+content=".*?"\s*\/?>/, `<meta name="twitter:image:alt" content="${imageAlt}" />`)

  return output
}

const prerenderSongPages = (): Plugin => {
  let outDir = ''

  return {
    name: 'prerender-song-pages',
    apply: 'build',
    configResolved(config) {
      outDir = resolveOutDir(config.root, config.build.outDir)
    },
    async closeBundle() {
      const { mkdir, readFile, writeFile } = await loadFileSystem()
      const indexPath = joinPath(outDir, 'index.html')
      const baseHtml = await readFile(indexPath, 'utf8')

      await Promise.all(
        songs.map(async (song) => {
          const songDir = joinPath(outDir, 'song', song.slug)
          const songHtml = applyPageMetadata(baseHtml, getSongPageMetadata(song))

          await mkdir(songDir, { recursive: true })
          await writeFile(joinPath(songDir, 'index.html'), songHtml)
        }),
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prerenderSongPages()],
})
