import classNames from "classnames";
import { Inter }  from "next/font/google";

import MetaHead from "@/components/MetaHead";


const inter = Inter({subsets: ["latin"]});


import "@/styles/globals.css";


export default function App({Component, pageProps}) {
  return <div className={classNames(inter.className, "body")}>
    <MetaHead/>
    <Component {...pageProps} />
  </div>;
}
