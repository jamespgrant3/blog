import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getPostsForTag, getTags } from "../../lib/tags";
import Post from "../../components/post";

export default function Tag({ id, posts }) {
  return (
    <Layout title={`tag ${id}`} tag>
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

export async function getServerSideProps({ params }) {
  const { id } = params;
  const posts = getPostsForTag(id);
  return {
    props: {
      id,
      posts,
    },
  };
}
