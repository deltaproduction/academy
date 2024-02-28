import React  from "react";
import Link from "next/link";

import FormItem from "@/app/components/FormItem";
import Links from "@/app/components/Links";
import FormRowSided from "@/app/components/FormRowSided";
import BlueButton from "@/app/components/BlueButton";

import styles from "@/app/(auth)/auth.module.scss";


export default function LoginPage() {
    return (
        <main>
            <h1>Вход</h1>

            <FormItem title="E-mail:" name="email" type="email" />
            <FormItem title="Пароль:" name="password" type="password" />
            <FormRowSided
                leftSide={<Links type="login" />}
                rightSide={<BlueButton text="Войти" />}
            />
        </main>
  );
}
