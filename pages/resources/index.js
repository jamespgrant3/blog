import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getResourcesPage } from "../../lib/resources";
import Link from "next/link";
import Footer from "../../components/footer";

export default function Resources({ page }) {
  return (
    <Layout resources>
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
        <h2 className={utilStyles.headingLg}>Resources</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
      <Footer title={page.title} />
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await getResourcesPage();
  return {
    props: {
      page,
    },
  };
}
