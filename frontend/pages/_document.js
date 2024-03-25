import { Html, Head, Main, NextScript } from "next/document";
import {QuestionMark} from "@mui/icons-material";

export default function Document() {
  return (
      <Html lang="en">
          <Head/>
          <body>
          <Main/>
          <NextScript/>
          </body>
          <div className="helpButton"><QuestionMark /></div>
      </Html>
  );
}
