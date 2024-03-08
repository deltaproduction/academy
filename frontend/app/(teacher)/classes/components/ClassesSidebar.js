'use client'

import { useAppContext }        from "@/app/components/ContextProvider";
import { Sidebar, SidebarItem } from "@/app/components/Sidebar";

export default function ClassesSidebar() {
  const {classes} = useAppContext()
  return <Sidebar title="Классы" newItemHref='/classes/new/'>
    {classes.map(({id, title}) => (
      <SidebarItem key={id} href={`/classes/${id}/`}>{title}</SidebarItem>)
    )}
  </Sidebar>
}