import { useState } from "react";
import { CSSTransition } from "react-transition-group";

import IconButton from "components/UI/IconButton";
import "./Search.css";

const Search = () => {
  const [displaySearchBar, setDisplaySearchBar] = useState(false);

  const toggleSearchBarHandler = () => {
    setDisplaySearchBar((prev) => !prev);
  };

  const searchHandler = (event) => {
    event.preventDefault();

    console.log("SEARCH!");
  };

  return (
    <div className="search">
      <CSSTransition
        classNames="search-bar"
        in={displaySearchBar}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <form onSubmit={searchHandler} className="search__bar">
          <input autoFocus={true} placeholder="Search Videos!" />
        </form>
      </CSSTransition>
      <IconButton
        className="search inversed"
        onClick={toggleSearchBarHandler}
      />
    </div>
  );
};

export default Search;
