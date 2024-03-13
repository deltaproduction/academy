import classNames from "classnames";
import { Inter }  from "next/font/google";

const inter = Inter({subsets: ["latin"]});

import "@/styles/globals.css";


export default function App({Component, pageProps}) {
  return <div className={classNames(inter.className, "body")}>
    <Component {...pageProps} />
  </div>;
}
