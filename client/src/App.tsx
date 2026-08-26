/**
 * Design shell: Contemporary Editorial Archive routes with a deliberately minimal application frame and a chronological reading path.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import AlbumPage from "@/pages/AlbumPage";
import FeastLookupPage from "@/pages/FeastLookupPage";
import Home from "@/pages/Home";
import TimelinePage from "@/pages/TimelinePage";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  const base = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/tra-cuu-le/:entryId" component={FeastLookupPage} />
        <Route path="/tra-cuu-le" component={FeastLookupPage} />
        <Route path="/album/:slug" component={AlbumPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
