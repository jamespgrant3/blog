import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Post from "../components/post";
import Link from "next/link";

export default function Home({ allPosts }) {
  return (
    <Layout title={siteTitle} home>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <p>
          Current deep dive:{" "}
          <Link href={`/posts/practice-ecs-thread`}>ecs</Link>
        </p>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPosts.map(({ id, date, title }) => (
            <Post key={id} id={id} date={date} title={title} />
          ))}{" "}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = getSortedPostsData();
  return {
    props: {
      allPosts,
    },
  };
}
