import { getProfileData } from "@/lib/api";
import Header             from "@/app/components/Header";
import { ContextProvider }    from "@/app/components/ContextProvider";


export default async function Layout({children}) {
  const response = await getProfileData();
  return (
    <ContextProvider context={{profile: await response.json()}}>
      <Header/>
      {children}
    </ContextProvider>
  );
}
