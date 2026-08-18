import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { SharedShell } from '@/components/shared-shell';
import Home from '@/pages/home';
import About from '@/pages/about';
import Services from '@/pages/services';
import ServiceDetail from '@/pages/service-detail';
import Gallery from '@/pages/gallery';
import Contact from '@/pages/contact';
import Book from '@/pages/book';
import BookingSuccess from '@/pages/booking-success';
import Privacy from '@/pages/privacy';
import Terms from '@/pages/terms';
import NotFound from '@/pages/not-found';

import { AdminLayout } from '@/components/admin/admin-layout';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminRequests from '@/pages/admin/requests';
import AdminServices from '@/pages/admin/services';
import AdminGallery from '@/pages/admin/gallery';
import AdminSettings from '@/pages/admin/settings';

const queryClient = new QueryClient();

function Router() {
  return (
    <SharedShell>
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
