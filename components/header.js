import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import headerStyles from "./header.module.css";

export default function Header({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className={utilStyles.marginTopZero}>
          A cloud architect, full-stack developer, command-line enthusiast, and
          passionate learner
        </p>
        <div className={headerStyles.links}>
          <div className={headerStyles.linkWrapper}>
            <Link className={headerStyles.link} href={`/`}>
              [blog]
            </Link>{" "}
            <Link className={headerStyles.link} href={`/deep-dives`}>
              [deep dives]
            </Link>{" "}
            <Link className={headerStyles.link} href={`/resources`}>
              [resources]
            </Link>{" "}
            <Link className={headerStyles.link} href={`/about`}>
              [about]
            </Link>{" "}
          </div>
        </div>
      </section>
      <hr />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title,
    },
  };
}
