import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getAboutPage } from "../../lib/about";
import Link from "next/link";
import Footer from "../../components/footer";

export default function About({ page }) {
  return (
    <Layout about>
      <Head>
        <title>{page.title}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          A passionate learner, cloud architect, full-stack developer, and
          command-line enthusiast
        </p>
        <Link href={`/`}>[blog]</Link>{" "}
        <Link href={`/resources`}>[resources]</Link>{" "}
        <Link href={`/about`}>[about]</Link>{" "}
      </section>
      <hr />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>About</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
      <Footer title={page.title} />
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await getAboutPage();
  return {
    props: {
      page,
    },
  };
}
