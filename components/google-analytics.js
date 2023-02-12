import ReactGA from "react-ga4";

export default function GoogleAnalytics({ page }) {
  const isProd = !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  if (isProd) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS);
    ReactGA.send({ hitType: "pageview", page });
  }
}

export async function getStaticProps() {
  return {
    props: {
      page,
    },
  };
}
