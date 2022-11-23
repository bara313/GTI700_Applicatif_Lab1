import React from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate
} from "react-router-dom";
import Page from './Page'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="meteo" element={<Page/>} />
        <Route
          path=""
          element={<Navigate to="/meteo"/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
