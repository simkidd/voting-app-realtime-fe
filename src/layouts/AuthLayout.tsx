import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
