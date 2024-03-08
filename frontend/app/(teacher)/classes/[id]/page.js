import Class                             from "@/app/(teacher)/classes/components/Class";
import { getGroupDetail, getGroupsList } from "@/lib/api";


export default async function Page({params: {id}}) {
  const response = await getGroupDetail(id)
  const group = await response.json()
  return <Class group={group}/>;
}
