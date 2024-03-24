import { API_HOST } from "@/lib/constants";

export const apiUrl = url => `${url.startsWith('http') ? '' : API_HOST}${url.startsWith('/') ? '' : '/'}${url}`

export const fetchApi = async (url, options = {}) => {
  const {req, res, ...init} = options

  if (req) {
    init.headers = req.headers;
  }

  url = apiUrl(url)

  const response = await fetch(url, init)

  if (res) {
    const setCookie = response.headers.getSetCookie()

    const existsSetCookies = {}

    const resSetCookie = res.getHeaders('Set-Cookie')['set-cookie']

    resSetCookie && resSetCookie.forEach((cookie, index) => {
      existsSetCookies[cookie.split(';')[0].split('=')[0]] = index
    })

    setCookie.forEach(cookie => {
      const [key, _] = cookie.split(';')[0].split('=');
      if (existsSetCookies.hasOwnProperty(key)) {
        res.getHeaders('Set-Cookie')[existsSetCookies[key]] = cookie
      } else {
        res.appendHeader("Set-Cookie", cookie)
      }
    })
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

  list = async ({queryParams, ...options}) => {
    let searchParams = ''
    if (queryParams) {
      searchParams = '?' + new URLSearchParams(queryParams)
    }
    return await fetchApi(this.url + searchParams, options)
  }

  retrieve = async (id, options) => {
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
      method: 'PATCH',
      body: formData
    })
  }

  delete = async (id, formData, options) => {
    return await fetchApi(`${this.url}${id}/`, {
      ...options,
      method: 'DELETE'
    })
  }
}

class TopicsApi_ extends ModelApi
{
  startTask = async (id, options) => {
    return await fetchApi(`${this.url}${id}/start_task/`, {
      ...options,
      method: 'POST'
    })
  }
  uploadFile = async (id, formData, options) => {
    return await fetchApi(`${this.url}${id}/upload_file/`, {
      ...options,
      method: 'POST',
      body: formData
    })
  }

  deleteFile = async (fileId, formData, options) => {
    return await fetchApi(`/api/topic_attachments/${fileId}/`, {
      ...options,
      method: 'DELETE'
    })
  }
}

export const runCodeApi = async (formData, options) => {
  return await fetchApi('/api/run_code/', {
    ...options,
    method: 'POST',
    body: formData
  })
}

export const ClassesApi = new ModelApi('/api/groups/')

export const CoursesApi = new ModelApi('/api/courses/')

export const TopicsApi = new TopicsApi_('/api/topics/')

export const TasksApi = new ModelApi('/api/tasks/')
export const TestCasesApi = new ModelApi('/api/test_cases/')

export const AttemptsApi = new ModelApi('/api/attempts/')
