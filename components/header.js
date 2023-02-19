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
            <div className={headerStyles.link}>
              <Link href={`/`}>[posts]</Link>{" "}
            </div>
            <div className={headerStyles.link}>
              <Link href={`/deep-dives`}>[deep dives]</Link>{" "}
            </div>
            <div className={headerStyles.link}>
              <Link href={`/resources`}>[resources]</Link>{" "}
            </div>
            <div className={headerStyles.link}>
              <Link href={`/about`}>[about]</Link>{" "}
            </div>
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
