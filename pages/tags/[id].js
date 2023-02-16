import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getPostsForTag, getTags } from "../../lib/tags";
import Post from "../../components/post";
import Link from "next/link";
import Footer from "../../components/footer";

export default function Tag({ id, posts }) {
  return (
    <Layout tag>
      <Head>
        <title>tag: {id}</title>
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
        <h2 className={utilStyles.headingLg}>Posts for: #{id}</h2>
        <ul className={utilStyles.list}>
          {" "}
          {posts ? (
            <ul className={utilStyles.list}>
              {posts.map(({ id, date, title }) => (
                <Post key={id} id={id} date={date} title={title} />
              ))}
            </ul>
          ) : (
            <div>no posts</div>
          )}{" "}
        </ul>
      </section>
      <Footer title={`tag: ${id}`} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getTags();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const posts = getPostsForTag(id);
  return {
    props: {
      id,
      posts,
    },
  };
}
