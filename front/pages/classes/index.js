'use client'
import { useAppContext } from "@/app/components/ContextProvider";
import { redirect }      from "next/navigation";


export default function Page() {
  const {classes} = useAppContext()
  if (!classes.length) {
    redirect('/classes/new/')
  }
  redirect(`/classes/${classes[0].id}/`)
}
