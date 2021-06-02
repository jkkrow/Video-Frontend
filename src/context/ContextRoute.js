import { Route } from "react-router-dom";
import PropTypes from "prop-types";

const ContextRoute = ({ exact, path, Provider, Component }) => {
  return (
    <Route path={path} exact={exact}>
      <Provider>
        <Component />
      </Provider>
    </Route>
  );
};

ContextRoute.propTypes = {
  Provider: PropTypes.any,
  Component: PropTypes.any,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default ContextRoute;
