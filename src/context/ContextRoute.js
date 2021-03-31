import { Route } from "react-router-dom";
import PropTypes from "prop-types";

const ContextRoute = (props) => {
  const { Provider, Component } = props;

  return (
    <Route path={props.path} exact={props.exact}>
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
