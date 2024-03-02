import { API_HOST } from "@/lib/constants";
import { redirect } from "next/navigation";

export const fetchApi = async (url, options) => {

  const res = await fetch(url, options)
  if (res.status === 401) {
    redirect('/sign_in')
  }
  return {...await res.json(), status: res.status}
}