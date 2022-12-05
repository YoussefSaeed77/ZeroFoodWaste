import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";
import { CurrentUserProvider } from "./CurrentUserContext";
import App from "./App";

ReactDOM.render(
  <Auth0Provider
    domain="dev-kclk3ecw6gf70s1r.us.auth0.com"
    clientId="ARgZno973Xg4eHkKTPXtEa4gKgHpqzKB"
    redirectUri={window.location.origin}
  >
    <CurrentUserProvider>
    <App />
    </CurrentUserProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
