import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getResourcesPage } from "../../lib/resources";
import Footer from "../../components/footer";
import Header from "../../components/header";

export default function Resources({ page }) {
  return (
    <Layout resources>
      <Header title={page.title}></Header>
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
