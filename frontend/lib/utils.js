import { getProfileData } from "@/lib/api";

export async function getProfileServerSideProps({req, res}) {
  let response = await getProfileData({req, res})
  if (response.ok) {
    return {
      props: {
        profile: await response.json()
      }
    }
  }
  throw {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}
