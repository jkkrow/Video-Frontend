import { useState } from "react";
import { CSSTransition } from "react-transition-group";

import IconButton from "components/UI/IconButton";
import Input from "components/FormElement/Input";
import "./Search.css";

const Search = () => {
  const [displaySearchBar, setDisplaySearchBar] = useState(false);

  const toggleSearchBarHandler = () => {
    setDisplaySearchBar((prev) => !prev);
  };

  const hideSearchBarHandler = () => {
    setDisplaySearchBar(false);
  };

  const searchHandler = (event) => {
    event.preventDefault();

    console.log("SEARCH!");
  };

  return (
    <div className="search">
      {!displaySearchBar && (
        <IconButton className="search" onClick={toggleSearchBarHandler} />
      )}
      <CSSTransition
        classNames="search-bar"
        in={displaySearchBar}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <form onSubmit={searchHandler} className="search__bar">
          <Input
            autoFocus={true}
            placeholder="Search Videos!"
            onBlur={hideSearchBarHandler}
          />
        </form>
      </CSSTransition>
    </div>
  );
};

export default Search;
