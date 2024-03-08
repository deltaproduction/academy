import { headers }  from 'next/headers'
import { API_HOST } from "@/lib/constants";
import { fetchApi } from "@/lib/api";

export function camelize(obj) {
  return obj;
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
      newObj[camelCaseKey] = camelize(obj[key]);
    }
  }
  return newObj;
}
