import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import "./Search.css";

const Search = () => {
  const searchHandler = (event) => {
    event.preventDefault();

    console.log("SEARCH!");
  };

  return (
    <form className="search__container" onSubmit={searchHandler}>
      <label>
        <SearchIcon />
        <input
          className="search__input"
          type="text"
          placeholder="Search Videos"
        />
      </label>
    </form>
  );
};

export default Search;
