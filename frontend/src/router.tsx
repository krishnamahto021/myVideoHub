import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import {
  PortectedRoute,
  PortectedRouteHome,
} from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";

export const router = createBrowserRouter([
  { path: "/sign-up", element: <PortectedRoute element={<SignUp />} /> },
  { path: "/sign-in", element: <PortectedRoute element={<SignIn />} /> },
  {
    path: "/user/profile",
    element: <PortectedRouteHome element={<UserProfile />} />,
  },
  {
    path: "/reset-password",
    element: <PortectedRoute element={<ResetPasswordEmail />} />,
  },
  {
    path: "/reset-password/:token",
    element: <PortectedRoute element={<UpdatePassword />} />,
  },
]);
