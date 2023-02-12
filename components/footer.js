import GoogleAnalytics from "./google-analytics";

export default function Footer({ title }) {
  return (
    <>
      <GoogleAnalytics page={title} />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title
    }
  }
}
