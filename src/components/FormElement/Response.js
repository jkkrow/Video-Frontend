import "./Response.css";

const Response = ({ type, content }) =>
  content ? (
    <div className={`response${type === "error" ? " error" : " message"}`}>
      {content}
    </div>
  ) : null;

export default Response;
