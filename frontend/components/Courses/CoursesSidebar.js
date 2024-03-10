import { useAppContext }        from "@/components/ContextProvider";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

export default function CoursesSidebar() {
  const {courses} = useAppContext()

  return <Sidebar title="Курсы" newItemHref='/courses/new/'>
    {courses.map(({id, title}) => (
      <SidebarItem key={id} href={`/courses/${id}/`}>{title}</SidebarItem>)
    )}
  </Sidebar>
}