import Header from "@/components/Header";

export default function AppLayout({profile, children}) {
  return (
    <>
      <Header
        profile={profile}
        menu={profile.role === 'teacher' ? [
          ["Классы", "/classes"],
          ["Курсы", "/courses"],
          ["Задачи на проверку", "check"]
        ] : [
          ["Классы", "/classes"],
        ]}
      />
      {children}
    </>
  );
}
