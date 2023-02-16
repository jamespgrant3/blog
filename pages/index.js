import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Post from "../components/post";
import Link from "next/link";
import Footer from "../components/footer";

export default function Home({ allPosts }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          A passionate learner, cloud architect, full-stack developer, and
          command-line enthusiast
        </p>
        <Link href={`/`}>[blog]</Link>{" "}
        <Link href={`/resources`}>[resources]</Link>{" "}
        <Link href={`/about`}>[about]</Link>{" "}
      </section>
      <hr />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
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
