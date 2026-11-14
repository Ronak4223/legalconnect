import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SmoothScrollProvider } from "./animation/SmoothScroll.jsx";
import PageTransition from "./components/PageTransition.jsx";
import { AppProvider } from "./state/store.jsx";
import { Toasts } from "./ui/Toasts.jsx";
import Home from "./pages/Home.jsx";
import LegalPage from "./pages/LegalPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { RequireRole } from "./layouts/RequireRole.jsx";

// Everything except the home page is code-split, so visitors who only see Home never download the app pages.
const PublicLayout = lazy(() => import("./layouts/PublicLayout.jsx"));
const DashLayout = lazy(() => import("./layouts/DashLayout.jsx"));
const FindLawyers = lazy(() => import("./pages/public/FindLawyers.jsx"));
const LawyerProfilePage = lazy(() => import("./pages/public/LawyerProfile.jsx"));
const LegalServices = lazy(() => import("./pages/public/LegalServices.jsx"));
const About = lazy(() => import("./pages/public/About.jsx"));
const Contact = lazy(() => import("./pages/public/Contact.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const RegisterUser = lazy(() => import("./pages/auth/RegisterUser.jsx"));
const RegisterLawyer = lazy(() => import("./pages/auth/RegisterLawyer.jsx"));
const Forgot = lazy(() => import("./pages/auth/Forgot.jsx"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard.jsx"));
const UserAppointments = lazy(() => import("./pages/user/Appointments.jsx"));
const UserPayments = lazy(() => import("./pages/user/Payments.jsx"));
const UserProfile = lazy(() => import("./pages/user/Profile.jsx"));
const UserCases = lazy(() => import("./pages/user/Pages.jsx").then((m) => ({ default: m.UserCases })));
const UserMessages = lazy(() => import("./pages/user/Pages.jsx").then((m) => ({ default: m.UserMessages })));
const UserNotifications = lazy(() => import("./pages/user/Pages.jsx").then((m) => ({ default: m.UserNotifications })));
const LawyerDashboard = lazy(() => import("./pages/lawyer/Dashboard.jsx"));
const LawyerProfileEdit = lazy(() => import("./pages/lawyer/Profile.jsx"));
const LawyerAppointments = lazy(() => import("./pages/lawyer/Appointments.jsx"));
const LawyerClients = lazy(() => import("./pages/lawyer/Clients.jsx"));
const LawyerEarnings = lazy(() => import("./pages/lawyer/Earnings.jsx"));
const LawyerSettings = lazy(() => import("./pages/lawyer/Settings.jsx"));
const LawyerCases = lazy(() => import("./pages/lawyer/Pages.jsx").then((m) => ({ default: m.LawyerCases })));
const LawyerMessages = lazy(() => import("./pages/lawyer/Pages.jsx").then((m) => ({ default: m.LawyerMessages })));
const LawyerNotifications = lazy(() => import("./pages/lawyer/Pages.jsx").then((m) => ({ default: m.LawyerNotifications })));

/**
 * Route map.
 *  Public:  /  /find-lawyers  /lawyer/:id  /legal-services  /about  /contact  /privacy  /terms
 *  Auth:    /register/user  /register/lawyer  /login/user  /login/lawyer  /forgot-password
 *  Client:  /user/{dashboard,appointments,cases,messages,notifications,payments,profile}
 *  Lawyer:  /lawyer/{dashboard,profile,appointments,clients,cases,messages,earnings,notifications,settings}
 * Static lawyer paths (e.g. /lawyer/dashboard) rank above the dynamic public profile /lawyer/:id.
 */
export default function App() {
  return (
    <AppProvider>
      <SmoothScrollProvider>
        <Suspense fallback={<div className="app" style={{ minHeight: "100vh" }} aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PublicLayout />}>
            <Route path="/find-lawyers" element={<FindLawyers />} />
            <Route path="/lawyer/:id" element={<LawyerProfilePage />} />
            <Route path="/legal-services" element={<LegalServices />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/lawyer" element={<RegisterLawyer />} />
          <Route path="/login/user" element={<Login role="user" />} />
          <Route path="/login/lawyer" element={<Login role="lawyer" />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/user" element={<RequireRole role="user"><DashLayout role="user" /></RequireRole>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="appointments" element={<UserAppointments />} />
            <Route path="cases" element={<UserCases />} />
            <Route path="messages" element={<UserMessages />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="payments" element={<UserPayments />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          <Route path="/lawyer" element={<RequireRole role="lawyer"><DashLayout role="lawyer" /></RequireRole>}>
            <Route path="dashboard" element={<LawyerDashboard />} />
            <Route path="profile" element={<LawyerProfileEdit />} />
            <Route path="appointments" element={<LawyerAppointments />} />
            <Route path="clients" element={<LawyerClients />} />
            <Route path="cases" element={<LawyerCases />} />
            <Route path="messages" element={<LawyerMessages />} />
            <Route path="earnings" element={<LawyerEarnings />} />
            <Route path="notifications" element={<LawyerNotifications />} />
            <Route path="settings" element={<LawyerSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <Toasts />
        <PageTransition />
      </SmoothScrollProvider>
    </AppProvider>
  );
}
