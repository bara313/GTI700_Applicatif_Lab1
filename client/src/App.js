import React from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate
} from "react-router-dom";
import PageAlert from './PageAlert'
import PageData from "./PageData";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="meteo" element={
          <>
            <PageAlert/>
            <PageData/>
          </> 
        } />
        <Route
          path=""
          element={<Navigate to="/meteo"/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
