import "./App.css";
import "./index.css";
import styles from "./App.module.css";

import { RelayEnvironmentProvider } from "react-relay";
import environment from "./relay.env.ts";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Pricing } from "./page/Pricing.page.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

function App() {
  console.log("start");

  return (
    <HelmetProvider>
      <RelayEnvironmentProvider environment={environment}>
        <ErrorBoundary>
          <Router>
            <div className={styles.appContainer}>
              <Routes>
                {/* / にアクセスがあったとき /search にリダイレクト */}
                <Route path="/" element={<Navigate to="/search" />} />
                {/* /search に Pricing ページを表示 */}
                <Route path="/search" element={<Pricing />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </RelayEnvironmentProvider>
    </HelmetProvider>
  );
}

export default App;
