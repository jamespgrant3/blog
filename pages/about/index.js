import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getAboutPage } from "../../lib/about";

export default function About({ page }) {
  return (
    <Layout title={page.title} about>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>About</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </Layout>
  );
}

export async function getServerSideProps() {
  const page = await getAboutPage();
  return {
    props: {
      page,
    },
  };
}
