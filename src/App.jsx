import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import axios from "axios";

function App() {

  axios.post("http://localhost:5000/");

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
