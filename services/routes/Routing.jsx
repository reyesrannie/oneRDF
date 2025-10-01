import React, { lazy, useMemo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { decodeUser } from "../functions/saveUser";
import SystemNavigation from "../constant/SystemNavigation";
import { filterNavigationByAccess } from "../functions/checkValues";
import Redirect from "../../screens/redirect/Redirect";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Login = lazy(() => import("../../screens/login/Login"));

const Routing = () => {
  const user = decodeUser();
  const { navigation, getFirstAccessibleRoute } = SystemNavigation();

  const filterNavigation = filterNavigationByAccess(
    navigation,
    user?.access_permission
  );

  const defaultRoute = useMemo(
    () => getFirstAccessibleRoute(filterNavigation, user?.access_permission),
    [navigation]
  );

  const routes = useRoutes([
    {
      path: "/login",
      element: !user ? <Login /> : <Navigate to={defaultRoute} />,
    },
    {
      path: "/redirect",
      element: <Redirect />,
    },
    {
      path: "/",
      element: <ProtectedRoute isAuthenticated={user} />,
      children: filterNavigation?.map((route) => ({
        path: route?.route?.replace("/", ""),
        element: route?.element,
        children: route?.children?.map((childRoute) => ({
          path: childRoute?.segment,
          element: childRoute?.element,
        })),
      })),
    },

    {
      path: "*",
      element: <Navigate to={"/login"} />,
    },
  ]);

  return routes;
};

export default Routing;
