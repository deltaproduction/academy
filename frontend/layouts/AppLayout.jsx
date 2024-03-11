import Header from "@/components/Header";

export default function AppLayout({profile, children}) {
  return (
    <>
      <Header profile={profile}/>
      {children}
    </>
  );
}
