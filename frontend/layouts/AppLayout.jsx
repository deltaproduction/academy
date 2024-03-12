import Header from "@/components/Header";

export default function AppLayout({profile, children}) {
  return (
    <>
      <Header
          profile={profile}
          menu={[
              ["Классы", "/classes"],
              ["Курсы", "/courses"],
              ["Задачи на проверку", "check"]
          ]}
      />
      {children}
    </>
  );
}
