import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
const App = () => {
  
  return (
    <>
        <BrowserRouter>
           <UserProvider > 
           <AppRoutes />
           </UserProvider>
        </BrowserRouter>
  
    </>
  );
};

export default App;


