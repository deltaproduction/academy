import { ClassesApi }                from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";
import AppLayout                     from "@/layouts/AppLayout";
import { CharField }                 from "@/components/Fields";

import styles       from './index.module.scss'
import SubmitButton from "components/SubmitButton";

export async function getServerSideProps({query: {id}, req, res}) {
  try {
    const {props} = await getProfileServerSideProps({req, res})

    const response = await ClassesApi.list({req, res})
    const classes = await response.json()

    if (props.profile.isTeacher) {
      return {
        redirect: {
          destination: classes.length ? `/classes/${classes[0].id}/` : '/classes/new/',
          permanent: false
        }
      }
    }

    props.groups = classes

    return {props}
  } catch (e) {
    return e
  }
}

function StudentClasses({profile, groups}) {
  const onAddClassFormSubmit = async (e) => {
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

  return <AppLayout profile={profile}>
    <div className="container">
      <form className={styles.addClassForm} onSubmit={onAddClassFormSubmit}>
        <CharField label="Код класса" name="group" type="number"/>
        <SubmitButton text="Добавить"/>
      </form>
      {groups.map(({id, title, code}) => <div key={id}>
        <a href={`/classes/${id}/`}>{title}</a> {code}
      </div>)}
    </div>
  </AppLayout>
}


export default function Page(props) {
  return <StudentClasses {...props}/>
}
