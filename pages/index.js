import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Post from "../components/post";
import Link from "next/link";
import Footer from "../components/footer";
import Header from "../components/header";

export default function Home({ allPosts }) {
  return (
    <Layout home>
      <Header title={siteTitle}></Header>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <p>
          Current ongoing learnings:{" "}
          <Link href={`/posts/practice-eks-thread`}>eks</Link>
        </p>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPosts.map(({ id, date, title }) => (
            <Post key={id} id={id} date={date} title={title} />
          ))}{" "}
        </ul>
      </section>
      <Footer title={siteTitle} />
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
