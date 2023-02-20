import { useState } from "react";
import { saveComment } from "../lib/comment";
import Recaptcha from "../components/recaptcha";

export default function Comment() {
  const [comment, setComment] = useState("");
  const [token, setToken] = useState();

  const handleChange = ({ target }) => {
    setComment(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveComment(comment);
  };

  return (
    <>
      {/*
      <GoogleReCaptcha
        onVerify={(token) => {
          console.log('token', token);
          setToken(token);
        }}
      />
      */}
      <Recaptcha />
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} value={comment} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
