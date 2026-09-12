const WP_API = import.meta.env.PUBLIC_WP_API

// El hosting de WP a veces descarta conexiones desde las IPs de los build
// servers de Vercel (probablemente un firewall/plugin de seguridad
// reaccionando a varias requests seguidas durante un mismo build). Reintenta
// con backoff antes de rendirse, para que un bloqueo puntual no vacíe la
// sección entera en el sitio generado.
async function fetchWithRetry(url, { retries = 2, timeoutMs = 15000 } = {}) {
  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    } catch (err) {
      lastErr = err
      const isLastAttempt = attempt === retries
      console.error(`fetchWithRetry: intento ${attempt + 1}/${retries + 1} falló para ${url}`, err)
      if (!isLastAttempt) {
        await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
      }
    }
  }
  throw lastErr
}

export async function getLatestPosts(count = 3) {
  try {
    const res = await fetchWithRetry(`${WP_API}/posts?per_page=${count}&_embed`)
    if (!res.ok) {
      console.error(`getLatestPosts: WP respondió ${res.status} ${res.statusText}`)
      return []
    }
    return res.json()
  } catch (err) {
    console.error('getLatestPosts: fetch falló', err)
    return []
  }
}

export async function getPostBySlug(slug) {
  try {
    const res = await fetchWithRetry(`${WP_API}/posts?slug=${slug}&_embed`)
    if (!res.ok) {
      console.error(`getPostBySlug: WP respondió ${res.status} ${res.statusText}`)
      return null
    }
    const posts = await res.json()
    return posts[0] ?? null
  } catch (err) {
    console.error('getPostBySlug: fetch falló', err)
    return null
  }
}

export async function getAllPosts() {
  try {
    const res = await fetchWithRetry(`${WP_API}/posts?per_page=100&_embed`)
    if (!res.ok) {
      console.error(`getAllPosts: WP respondió ${res.status} ${res.statusText}`)
      return []
    }
    return res.json()
  } catch (err) {
    console.error('getAllPosts: fetch falló', err)
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
      const res = await fetchWithRetry(`${WP_API}/media/${archivo}`)
      if (!res.ok) {
        console.error(`resolveFileUrl: WP respondió ${res.status} ${res.statusText}`)
        return '#'
      }
      const media = await res.json()
      return media.source_url ?? '#'
    } catch (err) {
      console.error('resolveFileUrl: fetch falló', err)
      return '#'
    }
  }
  return '#'
}

export async function getResources(count = 20) {
  try {
    const res = await fetchWithRetry(`${WP_API}/recursos?per_page=${count}&_embed`)
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
