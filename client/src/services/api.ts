const API_BASE_URL = 'https://tweetly-t1jv.onrender.com/api'


export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('tweetly_token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.')
  }

  return data
}