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

class ModelApi {
  constructor(url) {
    this.url = url;
  }

  list = async (options) => {
    return await fetchApi(this.url, options)
  }

  detail = async (id, options) => {
    return await fetchApi(`${this.url}${id}/`, options)
  }

  create = async (formData, options) => {
    return await fetchApi(this.url, {
      ...options,
      method: 'POST',
      body: formData
    })
  }

  update = async (id, formData, options) => {
    return await fetchApi(`${this.url}${id}/`, {
      ...options,
      method: 'PUT',
      body: formData
    })
  }
}

export const ClassesApi = new ModelApi('/api/groups/')
export const CoursesApi = new ModelApi('/api/courses/')

export const TopicsApi = new ModelApi('/api/topics/')
