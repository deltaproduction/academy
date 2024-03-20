import { AttemptsApi }                               from "@/lib/api";
import { formatDateTime, getTeacherServerSideProps } from "@/lib/utils";
import AppLayout                                     from "@/layouts/AppLayout";


export async function getServerSideProps({req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    const response = await AttemptsApi.list({queryParams: {statuses: '0,1,4'}, req, res})

    props.attempts = await response.json()

    return {props}
  } catch (e) {
    return e
  }
}

const statuses = {
  0: 'Успешно',
  1: 'Неверно',
  4: 'На проверке'
}

export default function Page({profile, attempts}) {
  return <AppLayout profile={profile}>
    <div className="container">
      {attempts.map(({id, student: {firstName, lastName}, task: {title}, createdAt, status}) => <div key={id}>
        <a
          href={`/attempts/${id}/`}>{title}: {lastName} {firstName} {formatDateTime(createdAt)}</a> - {statuses[status]}
      </div>)}
    </div>
  </AppLayout>
}
