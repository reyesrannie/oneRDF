import React, { lazy, useMemo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import SystemNavigation from "../constant/SystemNavigation";
import { filterNavigationByAccess } from "../functions/checkValues";
import Redirect from "../../screens/redirect/Redirect";
import { useSelector } from "react-redux";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Login = lazy(() => import("../../screens/login/Login"));

const Routing = () => {
  const userData = useSelector((state) => state.auth.userData);
  const { navigation, getFirstAccessibleRoute } = SystemNavigation();

  const filterNavigation = filterNavigationByAccess(
    navigation,
    userData?.access_permission,
  );

  const defaultRoute = useMemo(
    () =>
      getFirstAccessibleRoute(filterNavigation, userData?.access_permission),
    [navigation],
  );

  const routes = useRoutes([
    {
      path: "/login",
      element: !userData ? <Login /> : <Navigate to={defaultRoute} />,
    },
    {
      path: "/redirect",
      element: <Redirect />,
    },
    {
      path: "/",
      element: <ProtectedRoute isAuthenticated={userData} />,
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
