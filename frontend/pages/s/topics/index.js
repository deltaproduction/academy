import { TopicsApi } from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import AppLayout from "@/layouts/AppLayout";

import { Sidebar, SidebarItem } from "@/components/Sidebar";

import styles from "../../classes/[id]/index.module.scss";



export async function getServerSideProps({req, res}) {
  const {props} = await getProfileServerSideProps({req, res})

  const topicsListRes = await TopicsApi.list({req, res})
  props.topics = await topicsListRes.json()
  return {props}
}

function Layout({children, classes, profile}) {
  return (
    <AppLayout profile={profile}>
      <div className={styles.container}>
      </div>
    </AppLayout>
  );
}


export default function TopicsList({topics, profile}) {
  console.log('----')
  console.log(topics)
  // topics.map((topic) =>{console.log(topic.title)};
  return (<Layout classes={topics} profile={profile}>
    {topics.map((topic) => (
      <div key={topic.id}>
        <h3>{topic.title}</h3>
      </div>
    ))}
  </Layout>)
}
