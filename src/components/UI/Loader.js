import "./Loader.css";

const Loader = ({ display }) =>
  display ? (
    <div className="loader__container">
      <div className="loader" />
    </div>
  ) : null;

export default Loader;
