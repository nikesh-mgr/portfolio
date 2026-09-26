import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import router from "@/app/Route";
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors />
    </>
  );
};
export default App;
