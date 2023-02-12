import Link from "next/link";
import Date from "./date";
import utilStyles from "../styles/utils.module.css";

export default function Post({ id, date, title }) {
  return (
    <li className={utilStyles.listItem}>
      <Link href={`/posts/${id}`}>{title}</Link>
      <br />
      <small className={utilStyles.lightText}>
        <Date dateString={date} />
      </small>
    </li>
  );
}
