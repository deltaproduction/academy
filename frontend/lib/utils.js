import { headers }  from 'next/headers'
import { API_HOST } from "@/lib/constants";


function camelizeObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
      newObj[camelCaseKey] = camelizeObjectKeys(obj[key]);
    }
  }
  return newObj;
}

export const getProfileData = async () => {
  const response = await fetch(API_HOST + '/api/profile', {headers: headers()})
  return camelizeObjectKeys(await response.json())
}