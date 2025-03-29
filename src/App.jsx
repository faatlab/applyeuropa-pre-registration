import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home.jsx";
import { Slide, ToastContainer } from "react-toastify";
import { FrappeProvider } from "frappe-react-sdk";
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
         <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Slide}
         />
      </>
   );
}

export default App;
