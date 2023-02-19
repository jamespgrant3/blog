import GoogleAnalytics from "./google-analytics";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import footerStyles from "./footer.module.css";

export default function Footer({ title }) {
  return (
    <div className={footerStyles.footer}>
      <div className={footerStyles.iconWrapper}>
        <Link className={footerStyles.icon} href="https://github.com/jamespgrant3">
          <FaGithub />
        </Link>
        <Link className={footerStyles.icon} href="https://twitter.com/jamespgrant3">
          <FaTwitter />
        </Link>
        <Link className={footerStyles.icon} href="https://www.linkedin.com/in/jamespgrant3">
          <FaLinkedin />
        </Link>
        <Link className={footerStyles.icon} href="mailto:jamespgrant3@gmail.com">
          <AiOutlineMail />
        </Link>
      </div>
      <GoogleAnalytics page={title} />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title,
    },
  };
}
