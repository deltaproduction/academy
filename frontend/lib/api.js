import { API_HOST } from "@/lib/constants";
import { headers }  from "next/headers";


export const fetchApi = async (url, options) => {
  url = `${url.startsWith('http') ? '' : API_HOST}${url.startsWith('/') ? '' : '/'}${url}`
  return await fetch(url, options)
}

export const getProfileData = async (options) => {
  return await fetchApi('/api/profile', options)
}