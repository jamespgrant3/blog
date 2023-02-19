import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getResourcesPage } from "../../lib/resources";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Link from "next/link";

export default function DeepDives({ page }) {
  return (
    <Layout deepDives>
      <Header title={page.title}></Header>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Deep Dives</h2>
      </section>
      <article>
        <ul>
          <li>
            <Link href={`/posts/practice-eks-thread`}>eks</Link>{" "}
          </li>
        </ul>
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
