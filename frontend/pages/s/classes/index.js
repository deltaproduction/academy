import { ClassesApi }                from "@/lib/api";
import { getStudentServerSideProps } from "@/lib/utils";

import AppLayout    from "@/layouts/AppLayout";
import FormItem     from "@/components/FormItem";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";


export async function getServerSideProps({req, res}) {
  const {props} = await getStudentServerSideProps({req, res})

  const classesListRes = await ClassesApi.list({req, res})
  props.groups = await classesListRes.json()
  return {props}
}

function Layout({children, profile}) {
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


export default function ClassesList({groups, profile}) {
  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await fetch('/api/group_student/create/', {
      method: 'POST',
      body: formData
    })
    if (response.ok) {
      location.reload();
    }
  }

  return (<Layout profile={profile}>
    <form onSubmit={onFormSubmit}>
      <FormItem title="Код класса:" name="code" type="number"/>
      <FormRowSided
        leftSide={<Button type="submit" text="Добавить"/>}
      />
    </form>
    {groups.map((group) => (
      <div key={group.id}>
        <a href={`/s/classes/${group.id}`}>{group.title}</a>
        <div>тут какая-то инфа про этот класс</div>
      </div>
    ))}
  </Layout>)
}
