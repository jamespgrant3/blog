import "../styles/global.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  // hack to get around s3 redirect rule, to avoid access denied errors on refresh
  const router = useRouter();

  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];

  if (path) {
    router.replace(path);
  }

  return <Component {...pageProps} />;
}
