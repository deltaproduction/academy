import { TopicsApi }                 from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";
import AppLayout         from "@/layouts/AppLayout";

export async function getServerSideProps({query: {topic}, req, res}) {
  try {
    const {props} = await getProfileServerSideProps({req, res})

    const topicsRes = await TopicsApi.retrieve(topic, {req, res})
    if (topicsRes.ok) {
      props.topic = await topicsRes.json()
    }

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Topic = ({topic, profile}) => {
  return <AppLayout profile={profile}>
    {topic.title}
  </AppLayout>
}

export default Topic
