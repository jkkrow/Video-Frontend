import { ReactComponent as SearchButton } from "assets/icons/search.svg";
import "./Search.css";

const Search = () => {
  const searchHandler = (event) => {
    event.preventDefault();

    console.log("SEARCH!");
  };

  return (
    <form className="search__container" onSubmit={searchHandler}>
      <label>
        <SearchButton className="search__button" type="search" />
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
