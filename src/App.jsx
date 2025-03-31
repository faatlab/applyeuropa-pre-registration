import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home.jsx";
import { FrappeProvider } from "frappe-react-sdk";
import { Toaster } from "sonner";
const api_key = import.meta.env.VITE_FRAPPE_STUDENT_KEY;
const api_secret = import.meta.env.VITE_FRAPPE_STUDENT_SECRET;
const frappe_url = import.meta.env.VITE_FRAPPE_URL;

function App() {
   return (
      <>
         <FrappeProvider
            url={frappe_url}
            tokenParams={{
               type: "token",
               useToken: "true",
               token: () => `${api_key}:${api_secret}`,
            }}
            enableSocket={false}
         >
            <Routes>
               <Route path="/" element={<Home />}></Route>
            </Routes>
         </FrappeProvider>
         <Toaster position="bottom-center" duration={2100} richColors />
      </>
   );
}

export default App;
