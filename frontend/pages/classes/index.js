import {ClassesApi} from "@/lib/api";
import {getProfileServerSideProps} from "@/lib/utils";
import AppLayout from "@/layouts/AppLayout";
import {CharField} from "@/components/Fields";

import styles from './index.module.scss'
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";

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

function CodeBlock({code}) {
  return (<div className={styles.classCodeBlock} onClick={() => navigator.clipboard.writeText(code)}>
    {code.toString().split('').map((letter, i) => (
        <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>
    ))}
  </div>);
}

function ClassCard({id, title, code}) {
  return <a href={`/classes/${id}/`} key={id} className={styles.classCardLink}>
    <div className={styles.classCardWrapper}>
      <div className={styles.leftSide}>
        <h1>{title}</h1>
        <div>
          <p>Учитель: Самедова З. Д.</p>
          <p>Кл.рук.: Самедова З. Д.</p>
        </div>
      </div>
      <div className={styles.rightSide}>
        <CodeBlock code={code}/>
        <p>Рейтинг: 12.4 из 50</p>
      </div>
    </div>
  </a>;
}

function StudentClasses({profile, groups}) {
  const [errors, setErrors] = useState('')

  const onAddClassFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const response = await fetch('/api/group_student/create/', {
      method: 'POST',
      body: formData
    })
    if (response.ok) {
      location.reload();
    } else {
      setErrors(await response.json())
    }
  }

  return <AppLayout profile={profile}>
    <div className="container">
      <form className={styles.addClassForm} onSubmit={onAddClassFormSubmit}>
        <CharField label="Код класса" name="group" type="number" error={errors ? errors["group"] : null}/>
        <SubmitButton text="Добавить"/>
      </form>
      <div className={styles.classCards}>
        {groups.map(({id, title, code}) => <ClassCard key={id} id={id} title={title} code={code} />)}
      </div>
    </div>
  </AppLayout>
}


export default function Page(props) {
  return <StudentClasses {...props}/>
}
