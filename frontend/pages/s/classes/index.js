import { ClassesApi } from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import AppLayout from "@/layouts/AppLayout";
import FormItem     from "@/components/FormItem";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";


export async function getServerSideProps({req, res}) {
  const {props} = await getProfileServerSideProps({req, res})

    const classesListRes = await ClassesApi.list({req, res})
    props.groups = await classesListRes.json()
    return {props}
}

function Layout({children, classes, profile}) {
  return (
    <AppLayout profile={profile}>
      <div>
        <div>
          <h3>Выберите класс</h3>
          <div>
          </div>
        </div>
        <div>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}


export default function ClassesList({groups, profile, code}) {
  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    await fetch('/api/group-student/create/', {
      method: 'POST',
      body: formData
    })
    location.reload();
  }

  return (<Layout classes={groups} profile={profile}>
    <form onSubmit={onFormSubmit}>
      <FormItem title="Код класса:" name="code" type="number"/>
      <FormRowSided
        leftSide={<Button type="submit" text="Добавить"/>}
      />
    </form>
    {groups.map((group) => (
      <div key={group.id}>
        <h4>{group.title}</h4>
        <div>тут какая-то инфа про этот класс</div>
      </div>
    ))}
  </Layout>)
}
