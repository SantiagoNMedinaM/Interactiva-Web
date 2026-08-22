const WP_API = import.meta.env.PUBLIC_WP_API

export async function getLatestPosts(count = 3) {
  const res = await fetch(`${WP_API}/posts?per_page=${count}&_embed`)
  if (!res.ok) return []
  return res.json()
}

export async function getPostBySlug(slug) {
  const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`)
  if (!res.ok) return null
  const posts = await res.json()
  return posts[0] ?? null
}

export async function getAllPosts() {
  const res = await fetch(`${WP_API}/posts?per_page=100&_embed`)
  if (!res.ok) return []
  return res.json()
}
