const WP_API = import.meta.env.PUBLIC_WP_API

export async function getLatestPosts(count = 3) {
  try {
    const res = await fetch(`${WP_API}/posts?per_page=${count}&_embed`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getPostBySlug(slug) {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`)
    if (!res.ok) return null
    const posts = await res.json()
    return posts[0] ?? null
  } catch {
    return null
  }
}

export async function getAllPosts() {
  try {
    const res = await fetch(`${WP_API}/posts?per_page=100&_embed`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

async function resolveFileUrl(archivo) {
  if (typeof archivo === 'string') return archivo
  if (typeof archivo === 'number') {
    try {
      const res = await fetch(`${WP_API}/media/${archivo}`)
      if (!res.ok) return '#'
      const media = await res.json()
      return media.source_url ?? '#'
    } catch {
      return '#'
    }
  }
  return '#'
}

export async function getResources(count = 20) {
  try {
    const res = await fetch(`${WP_API}/recursos?per_page=${count}&_embed`)
    if (!res.ok) {
      console.error(`getResources: WP respondió ${res.status} ${res.statusText}`)
      return []
    }
    const items = await res.json()
    return Promise.all(items.map(async item => ({
      title: stripHtml(item.title?.rendered),
      body: stripHtml(item.content?.rendered),
      href: await resolveFileUrl(item.acf?.archivo),
    })))
  } catch (err) {
    console.error('getResources: fetch falló', err)
    return []
  }
}
