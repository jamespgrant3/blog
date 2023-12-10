import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getKeysPage } from "../../lib/keys";

export default function Keys({ page }) {
  return (
    <Layout title={page.title} keys>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Keys</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await getKeysPage();
  return {
    props: {
      page,
    },
  };
}
