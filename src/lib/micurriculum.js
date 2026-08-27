const MC_API = 'https://micurriculum.com.ar/api/avisos/ultimos'
const MC_BASE = 'https://www.micurriculum.com.ar/avisos'

const CONTRACT_LABELS = {
  COMPLETO: 'Tiempo completo',
  PARCIAL: 'Tiempo parcial',
  PASANTIA: 'Pasantía',
}

function normalize(job) {
  const createdAt = new Date(job.createdAt)
  const daysSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  const badge = daysSince <= 7 ? 'Nuevo' : 'Activo'

  return {
    id: job.ID,
    title: job.titulo,
    location: `${job.localidad?.nombre ?? ''}, ${job.provincia?.nombre ?? ''}`.replace(/^, |, $/, ''),
    type: CONTRACT_LABELS[job.contrato] ?? job.contrato ?? 'Tiempo completo',
    badge,
    url: `${MC_BASE}/${job.ID}`,
  }
}

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Gerente de Ventas – Rubro Industrial',
    location: 'Resistencia, Chaco',
    type: 'Tiempo completo',
    badge: 'Nuevo',
    url: MC_BASE,
  },
  {
    id: 2,
    title: 'Analista de RRHH Sr.',
    location: 'Corrientes Capital',
    type: 'Tiempo completo',
    badge: 'Activo',
    url: MC_BASE,
  },
  {
    id: 3,
    title: 'Jefe de Planta – Agroindustria',
    location: 'Formosa',
    type: 'Tiempo completo',
    badge: 'Activo',
    url: MC_BASE,
  },
]

export async function getLatestJobs(limit = 3) {
  try {
    const res = await fetch(MC_API)
    if (!res.ok) return MOCK_JOBS.slice(0, limit)
    const json = await res.json()
    const raw = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : null
    if (!raw || raw.length === 0) return MOCK_JOBS.slice(0, limit)
    return raw.slice(0, limit).map(normalize)
  } catch {
    return MOCK_JOBS.slice(0, limit)
  }
}

export async function getAllJobs() {
  return getLatestJobs(100)
}
