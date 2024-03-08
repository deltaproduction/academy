import { API_HOST } from "@/lib/constants";


export const fetchApi = async (url, options = {}) => {
  if (!options.headers && typeof window === 'undefined') {
    const {headers} = await import('next/headers')
    options.headers = headers()
  }
  url = `${url.startsWith('http') ? '' : API_HOST}${url.startsWith('/') ? '' : '/'}${url}`
  return await fetch(url, options)
}

export const getProfileData = async () => {
  return await fetchApi('/api/profile/')
}

export const getGroupsList = async () => {
  return await fetchApi('/api/groups/')
}

export const getGroupDetail = async (id) => {
  return await fetchApi(`/api/groups/${id}/`)
}

export const createGroup = async (formData) => {
  return await fetchApi('/api/groups/', {
    method: 'POST',
    body: formData
  })
}

export const updateGroup = async (id, formData) => {
  return await fetchApi('/api/groups/${id}/', {
    method: 'POST',
    body: formData
  })
}
