import React from "react";
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import { useAuthentication } from "./authUtils";


interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, loading } = useAuthentication();

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <div>Loading...</div>
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;
