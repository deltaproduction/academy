import { getProfileData } from "@/lib/api";

export async function getProfileServerSideProps({req, res, role}) {
  let response = await getProfileData({req, res})
  if (response.ok) {
    const profile = await response.json()

    if (role && profile.role !== role) {
      throw {notFound: true}
    }

    return {
      props: {profile}
    }
  }

  throw {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}

export async function getTeacherServerSideProps({req, res}) {
  return getProfileServerSideProps({req, res, role: 'teacher'})
}

export async function getStudentServerSideProps({req, res}) {
  return getProfileServerSideProps({req, res, role: 'student'})
}