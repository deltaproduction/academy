import { headers } from "next/headers";

import { camelize } from "@/lib/utils";
import { API_HOST } from "@/lib/constants";


export const fetchApi = async (url, options) => {
  if (!options && typeof window === 'undefined') {
    options = headers()
  }
  url = `${url.startsWith('http') ? '' : API_HOST}${url.startsWith('/') ? '' : '/'}${url}`
  const response = await fetch(url, options)
  response.camelized = camelize(await response.json())
  return response
}

export const getProfileData = async (options) => {
  return await fetchApi('/api/profile', options)
}

export const getClassesList = async (options) => {
  return await fetchApi('/api/classes', options)
}
