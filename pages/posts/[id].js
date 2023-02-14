import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import Link from "next/link";
import Footer from "../../components/footer";

export default function Post({ post }) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
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
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={post.date} />
        </div>
        <div>
        {!!post.tags.length && (
        <p>tags: {' '}
        {
          post.tags.map(tag => (
            <span key={tag}>
              <Link href={`/tags/${tag}`}>#{tag}</Link>{' '}
            </span>
          ))
        }
        </p>
        )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
      <Footer title={post.title} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.id)
  return {
    props: {
      post
    }
  }
}