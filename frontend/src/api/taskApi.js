import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/tasks',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.error || err.message || 'something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export function getAllTasks(filters) {
  const params = {}
  if (filters.search) params.search = filters.search
  if (filters.status) params.status = filters.status
  if (filters.priority) params.priority = filters.priority

  return api.get('/', { params }).then(res => res.data.tasks)
}

export function createTask(data) {
  return api.post('/', data).then(res => res.data)
}

export function updateTask(id, data) {
  return api.put(`/${id}`, data).then(res => res.data)
}

export function patchTask(id, data) {
  return api.patch(`/${id}`, data).then(res => res.data)
}

export function deleteTask(id) {
  return api.delete(`/${id}`)
}
