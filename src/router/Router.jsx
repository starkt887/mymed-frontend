import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppBar from "../components/AppBar/AppBar";
import useAuth from "../hooks/useAuth";
import ScrollToTop from "./ScrollToTop";
import useRoute from "../hooks/useRoute";
import SuspenseLoader from "../components/Loader/SuspenseLoader";

function Router() {
  const isLoggedIn = useAuth();
  const routes = useRoute();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppBar>
        <Routes>
          {routes.map(({ Component, auth, path }) =>
            auth ? (
              <Route
                key={path}
                path={path}
                element={
                  isLoggedIn ? (
                    <Suspense fallback={<SuspenseLoader />}>
                      <Component />
                    </Suspense>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            ) : (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<SuspenseLoader />}>
                    <Component />
                  </Suspense>
                }
              />
            )
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppBar>
    </BrowserRouter>
  );
}

export default Router;
