import { API_HOST } from "@/lib/constants";


export const fetchApi = async (url, options = {}) => {
  const {req, res, ...init} = options

  if (req) {
    init.headers = req.headers;
  }

  url = `${url.startsWith('http') ? '' : API_HOST}${url.startsWith('/') ? '' : '/'}${url}`

  const response = await fetch(url, init)

  if (res) {
    response.headers.getSetCookie().forEach(cookie => res.appendHeader("Set-Cookie", cookie))
  }

  return response
}

export const getProfileData = async (options) => {
  return await fetchApi('/api/profile/', options)
}

export const getGroupsList = async (options) => {
  return await fetchApi('/api/groups/', options)
}

export const getGroupDetail = async (id, options) => {
  return await fetchApi(`/api/groups/${id}/`, options)
}

export const createGroup = async (formData, options) => {
  return await fetchApi('/api/groups/', {
    ...options,
    method: 'POST',
    body: formData
  })
}

export const updateGroup = async (id, formData, options) => {
  return await fetchApi(`/api/groups/${id}/`, {
    ...options,
    method: 'PUT',
    body: formData
  })
}

export const getCoursesList = async (options) => {
  return await fetchApi('/api/courses/', options)
}

export const getCourseDetail = async (id, options) => {
  return await fetchApi(`/api/courses/${id}/`, options)
}

export const createCourse = async (formData, options) => {
  return await fetchApi('/api/courses/', {
    ...options,
    method: 'POST',
    body: formData
  })
}

export const updateCourse = async (id, formData, options) => {
  return await fetchApi(`/api/courses/${id}/`, {
    ...options,
    method: 'PUT',
    body: formData
  })
}
