import { PageMetadata } from '../data/songs'

const setMetaContent = (selector: string, content: string) => {
  const element = document.querySelector<HTMLMetaElement>(selector)
  if (element) {
    element.setAttribute('content', content)
  }
}

const setLinkHref = (selector: string, href: string) => {
  const element = document.querySelector<HTMLLinkElement>(selector)
  if (element) {
    element.setAttribute('href', href)
  }
}

export function syncPageMetadata(metadata: PageMetadata) {
  document.title = metadata.title

  setMetaContent('meta[name="description"]', metadata.description)
  setLinkHref('link[rel="canonical"]', metadata.canonicalUrl)
  setMetaContent('meta[property="og:title"]', metadata.title)
  setMetaContent('meta[property="og:description"]', metadata.description)
  setMetaContent('meta[property="og:url"]', metadata.canonicalUrl)
  setMetaContent('meta[property="og:image"]', metadata.imageUrl)
  setMetaContent('meta[property="og:image:secure_url"]', metadata.imageUrl)
  setMetaContent('meta[property="og:image:width"]', String(metadata.imageWidth))
  setMetaContent('meta[property="og:image:height"]', String(metadata.imageHeight))
  setMetaContent('meta[property="og:image:alt"]', metadata.imageAlt)
  setMetaContent('meta[name="twitter:title"]', metadata.title)
  setMetaContent('meta[name="twitter:description"]', metadata.description)
  setMetaContent('meta[name="twitter:image"]', metadata.imageUrl)
  setMetaContent('meta[name="twitter:image:alt"]', metadata.imageAlt)
}
