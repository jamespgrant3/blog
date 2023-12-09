import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getResourcesPage } from "../../lib/resources";
import Link from "next/link";

export default function DeepDives({ page }) {
  return (
    <Layout title={page.title} deepDives>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Deep Dives</h2>
      </section>
      <article>
        <ul>
          <li>
            <Link href={`/posts/practice-ecs-thread`}>ecs</Link>{" "}
          </li>
          <li>
            <Link href={`/posts/practice-eks-thread`}>eks</Link>{" "}
          </li>
        </ul>
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
