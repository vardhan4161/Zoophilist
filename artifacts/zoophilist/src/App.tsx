import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { SharedShell } from '@/components/shared-shell';
import { AdminLayout } from '@/components/admin/admin-layout';

const Home = lazy(() => import('@/pages/home'));
const About = lazy(() => import('@/pages/about'));
const Services = lazy(() => import('@/pages/services'));
const ServiceDetail = lazy(() => import('@/pages/service-detail'));
const Gallery = lazy(() => import('@/pages/gallery'));
const Contact = lazy(() => import('@/pages/contact'));
const Book = lazy(() => import('@/pages/book'));
const BookingSuccess = lazy(() => import('@/pages/booking-success'));
const Privacy = lazy(() => import('@/pages/privacy'));
const Terms = lazy(() => import('@/pages/terms'));
const NotFound = lazy(() => import('@/pages/not-found'));
const AdminLogin = lazy(() => import('@/pages/admin/login'));
const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminRequests = lazy(() => import('@/pages/admin/requests'));
const AdminServices = lazy(() => import('@/pages/admin/services'));
const AdminGallery = lazy(() => import('@/pages/admin/gallery'));
const AdminSettings = lazy(() => import('@/pages/admin/settings'));

const queryClient = new QueryClient();

function Router() {
  return (
    <SharedShell>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-live="polite" aria-label="Loading page" />}>
        <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/services/:id" component={ServiceDetail} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/book" component={Book} />
        <Route path="/book/success" component={BookingSuccess} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        
        {/* Admin Auth Route */}
        <Route path="/admin/login" component={AdminLogin} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin">
          {() => {
            // Redirect root /admin to dashboard, AdminLayout handles auth check
            return (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            );
          }}
        </Route>
        <Route path="/admin/dashboard">
          {() => <AdminLayout><AdminDashboard /></AdminLayout>}
        </Route>
        <Route path="/admin/requests">
          {() => <AdminLayout><AdminRequests /></AdminLayout>}
        </Route>
        <Route path="/admin/services">
          {() => <AdminLayout><AdminServices /></AdminLayout>}
        </Route>
        <Route path="/admin/gallery">
          {() => <AdminLayout><AdminGallery /></AdminLayout>}
        </Route>
        <Route path="/admin/settings">
          {() => <AdminLayout><AdminSettings /></AdminLayout>}
        </Route>
        
        <Route component={NotFound} />
        </Switch>
      </Suspense>
    </SharedShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
