import React, { useState } from "react";
import Form_Login_Signup from "./form-login-signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IntroPage from "./intro-page";
import DataHandler from "./data-handler";
import EnkripData from "./enkripdata";
import CobaForm from "./coba-form";
import EnkripBaru from "./enkrip-baru";
import Beranda from "./beranda";
import NavbarZakat from "./navbar-zakat";

function App() {
  const [inputData, setInputData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dekrip" element={<EnkripData />} />
          <Route
            path="/login"
            element={<Form_Login_Signup logSign={"log"} />}
          />
          <Route
            path="/signup"
            element={<Form_Login_Signup logSign={"sign"} />}
          />
          <Route path="/data-handler" element={<NavbarZakat />} />
          <Route path="/" element={<IntroPage dir={"beranda"} />} />
          <Route path="/add-staff" element={<IntroPage dir={"staff"} />} />
          <Route path="/add-pos" element={<IntroPage dir={"add-pos"} />} />
          <Route path="/pos/:idLink" element={<IntroPage dir={"pos"} />} />
          <Route
            path="/pos/:idLink/:idEdit"
            element={<IntroPage dir={"pos-edit"} />}
          />{" "}
          <Route
            path="/pos/:idLink/bayar"
            element={<IntroPage dir={"bayar"} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
