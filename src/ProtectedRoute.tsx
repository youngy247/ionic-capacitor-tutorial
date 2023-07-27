import React, { useEffect } from "react";
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import { useAuthentication } from "./authUtils";
import { useIonLoading } from '@ionic/react';


interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, loading } = useAuthentication();
  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    if (loading) {
      // present("Loading...");  //currently causes issues for logging in 
    } else {
      dismiss();
    }
  }, [loading, present, dismiss, isAuthenticated]);

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? null : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;
