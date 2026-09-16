import { Outlet } from "react-router-dom";
function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      {" "}
      <div className="w-full max-w-md">
        {" "}
        <Outlet />{" "}
      </div>{" "}
    </main>
  );
}
export default AuthLayout;
