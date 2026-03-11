export type PlatformType = 'Soundcloud' | 'Spotify' | 'Youtube' | 'Pre-save' | 'New-release'

export interface Song {
  slug: string
  image: string
  imageWidth: number
  imageHeight: number
  title: string
  artist: string
  type: PlatformType
  url: string
}

export interface PageMetadata {
  title: string
  description: string
  canonicalUrl: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  imageAlt: string
}

export const siteMetadata = {
  siteName: 'Share',
  siteUrl: 'https://sharemusic.media',
  defaultTitle: 'Share',
  defaultDescription: "Music, remixes, and new releases from Share. It's cool to be weird.",
  defaultImage: '/share-website-og.png',
  defaultImageWidth: 2390,
  defaultImageHeight: 1390,
  defaultImageAlt: 'Share music artwork preview',
} as const

export const songs: Song[] = [
  {
    slug: 'better-here',
    image: '/BetterHereIconCover.png',
    imageWidth: 1024,
    imageHeight: 1024,
    title: 'Better Here',
    artist: 'Share, Electricole',
    type: 'Spotify',
    url: 'https://open.spotify.com/track/3jmJRyfylBgC6SLiU7jbGh?si=79a7aff9e58a4eff',
  },
  {
    slug: 'never-lose-me-share-remix',
    image: '/FloMilliIconCover.png',
    imageWidth: 1024,
    imageHeight: 1024,
    title: 'Never Lose Me \n (Share Remix)',
    artist: 'Flo Milli',
    type: 'Soundcloud',
    url: 'https://soundcloud.com/kevinshare/flo-milli-never-lose-me-share-remix?si=ceffc9c05bd44e6f8532ac00f0b3b88f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
  },
  {
    slug: 'a-thousand-miles-share-remix',
    image: '/ThousanMilesIconCover.png',
    imageWidth: 1024,
    imageHeight: 1024,
    title: 'A Thousand Miles \n (Share Remix)',
    artist: 'Vanessa Carlton',
    type: 'Soundcloud',
    url: 'https://soundcloud.com/kevinshare/thousand-miles-share-remix-2?si=d1c49080a79a4c928b7c297464192041&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
  },
  {
    slug: 'fashion-killa-share-remix',
    image: '/FashionKillaIconCover.png',
    imageWidth: 1024,
    imageHeight: 1024,
    title: 'Fashion Killa \n (Share Remix)',
    artist: 'A$AP Rocky',
    type: 'Soundcloud',
    url: 'https://soundcloud.com/kevinshare/aap-rocky-fashion-killa-share-remix?si=a99963ffd7954150acb82f3b25c731b9&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
  },
  {
    slug: 'lonely-share-remix',
    image: '/LonelyIconCover.png',
    imageWidth: 1024,
    imageHeight: 1024,
    title: 'Lonely (Share Remix)',
    artist: 'Justin Bieber',
    type: 'Youtube',
    url: 'https://www.youtube.com/watch?v=6uDHEs2jUAU',
  },
]

export const isMultiPlatform = (type: PlatformType) => type === 'Pre-save' || type === 'New-release'

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const getAbsoluteUrl = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `${siteMetadata.siteUrl}${value.startsWith('/') ? value : `/${value}`}`
}

const getPlatformCopy = (song: Song) => {
  if (song.type === 'Pre-save') {
    return 'Pre-save on Spotify, SoundCloud, and YouTube.'
  }

  if (song.type === 'New-release') {
    return 'Listen on Spotify, SoundCloud, and YouTube.'
  }

  return `Listen on ${song.type}.`
}

export const getSongPath = (song: Song) => `/song/${song.slug}`

export const getSongBySlug = (slug: string) => songs.find((song) => song.slug === slug)

export const getRootPageMetadata = (): PageMetadata => ({
  title: siteMetadata.defaultTitle,
  description: siteMetadata.defaultDescription,
  canonicalUrl: `${siteMetadata.siteUrl}/`,
  imageUrl: getAbsoluteUrl(siteMetadata.defaultImage),
  imageWidth: siteMetadata.defaultImageWidth,
  imageHeight: siteMetadata.defaultImageHeight,
  imageAlt: siteMetadata.defaultImageAlt,
})

export const getSongPageMetadata = (song: Song): PageMetadata => ({
  title: `${normalizeText(song.title)} | ${siteMetadata.siteName}`,
  description: `${normalizeText(song.title)} by ${song.artist}. ${getPlatformCopy(song)}`,
  canonicalUrl: getAbsoluteUrl(getSongPath(song)),
  imageUrl: getAbsoluteUrl(song.image),
  imageWidth: song.imageWidth,
  imageHeight: song.imageHeight,
  imageAlt: `${normalizeText(song.title)} artwork`,
})
