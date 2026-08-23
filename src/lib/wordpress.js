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
