import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export default function Header({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          A cloud architect, full-stack developer, command-line enthusiast, and passionate learner
        </p>
        <Link href={`/`}>[blog]</Link>{" "}
        <Link href={`/deep-dives`}>[deep dives]</Link>{" "}
        <Link href={`/resources`}>[resources]</Link>{" "}
        <Link href={`/about`}>[about]</Link>{" "}
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
