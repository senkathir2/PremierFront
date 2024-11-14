import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";

import PhaseOverview from "./Pages/PhaseOverview";
import Dashboard from "./Pages/Dashboard";
import TestPage from "./Pages/TestPage";
import Header from "./Components/Header";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="peppl_p1" element={<PhaseOverview />}>
            <Route path="amf1a" element={<TestPage />}></Route>
            <Route path="amf1b" element={<TestPage />}></Route>
          </Route>
          <Route path="peppl_p2" element={<PhaseOverview />} />
          <Route path="peppl_p3" element={<PhaseOverview />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
