import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import axios from "axios";

function App() {

  axios.post("https://api.ibrahimhalilsezgin.fun/");

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
