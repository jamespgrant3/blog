import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getVimPage } from "../../lib/vim";

export default function Vim({ page }) {
  return (
    <Layout title={page.title} keys>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Vim Keybindings</h2>
      </section>
      <article>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await getVimPage();
  return {
    props: {
      page,
    },
  };
}
