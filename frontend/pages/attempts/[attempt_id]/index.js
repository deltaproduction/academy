import { AttemptsApi }                               from "@/lib/api";
import { formatDateTime, getTeacherServerSideProps } from "@/lib/utils";
import AppLayout                                     from "@/layouts/AppLayout";
import { SelectField } from "@/components/Fields";
import SubmitButton    from "@/components/SubmitButton";
import { useState }    from "react";


export async function getServerSideProps({query: {attempt_id}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    const response = await AttemptsApi.retrieve(attempt_id, {req, res})

    props.attempt = await response.json()

    return {props}
  } catch (e) {
    return e
  }
}

export default function Page({profile, attempt: attempt_}) {
  const [attempt, setAttempt] = useState(attempt_)
  const {id, student: {firstName, lastName}, code, status, createdAt} = attempt;

  const onStatusSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const result = await AttemptsApi.update(id, formData)
    if (result.ok) {
      setAttempt(await result.json())
    }
  }


  return <AppLayout profile={profile}>
    <div className="container">
      <form onSubmit={onStatusSubmit}>
        <SelectField label="Статус" name="status" defaultValue={status}>
          <option value="0">Успешно</option>
          <option value="1">Неверно</option>
          <option value="4">На проверке</option>
        </SelectField>
        <SubmitButton/>
      </form>
      {lastName} {firstName}
      {formatDateTime(createdAt)}
      <pre>{code}</pre>
    </div>
  </AppLayout>
}
