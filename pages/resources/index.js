import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getResourcesPage } from "../../lib/resources";

export default function Resources({ page }) {
  return (
    <Layout title={page.title} resources>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Resources</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </Layout>
  );
}

export async function getServerSideProps() {
  const page = await getResourcesPage();
  return {
    props: {
      page,
    },
  };
}
