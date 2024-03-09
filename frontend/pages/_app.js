import { Inter }  from "next/font/google";

const inter = Inter({subsets: ["latin"]});

import "@/styles/globals.css";
import classNames from "classnames";


export default function App({Component, pageProps, router}) {
  return <div className={classNames(inter.className, "body")}>
    <Component {...pageProps} />
  </div>;
}
