import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import "./Search.css";

const Search = () => {
  const searchHandler = (event) => {
    event.preventDefault();

    console.log("SEARCH!");
  };

  return (
    <form className="search__container" onSubmit={searchHandler}>
      <input
        className="search__input"
        id="search-input"
        type="text"
        placeholder="Search Videos"
      />
      <label htmlFor="search-input">
        <SearchIcon />
      </label>
    </form>
  );
};

export default Search;
