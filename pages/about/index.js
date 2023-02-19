import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getAboutPage } from "../../lib/about";
import Footer from "../../components/footer";
import Header from "../../components/header";

export default function About({ page }) {
  return (
    <Layout about>
      <Header title={page.title}></Header>
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
