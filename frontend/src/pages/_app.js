import { ApolloProvider } from "@apollo/client/react";
import client from "../lib/apollo-client";
import { CartProvider } from "../context/CartContext";
import { SettingsProvider } from "../context/SettingsContext";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <SettingsProvider initialSettings={pageProps.settings}>
        <AuthProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </ApolloProvider>
  );
}

export default MyApp;
