import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import IntakePage from '@/pages/IntakePage';
import DesignCanvas from '@/pages/DesignCanvas';
import CanonicalModelPage from '@/pages/CanonicalModelPage';
import RoadmapPage from '@/pages/RoadmapPage';
import OpsConsolePage from '@/pages/OpsConsolePage';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/intake",
    element: <IntakePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/design",
    element: <DesignCanvas />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/graph",
    element: <CanonicalModelPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/roadmap",
    element: <RoadmapPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/ops",
    element: <OpsConsolePage />,
    errorElement: <RouteErrorBoundary />,
  },
]);