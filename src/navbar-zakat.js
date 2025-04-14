import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getPosts } from "./data-server-handler.js";

function NavbarZakat(prop) {
  const [dataSvr, setDataSvr] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [valueInput, setValueInput] = useState(["Rizky", "Putri", "Pertiwi"]);

  const DataHendler = async () => {
    try {
      const getPos = await getPosts();
      console.log(getPos);
    } catch (error) {
      console.log(error);
    } finally {
      setFetch(true);
    }
  };
  useEffect(() => {
    DataHendler();
  }, [fetch, setFetch]);
  const [pilihan, setPilihan] = useState("");

  const options = ["Makan", "Tidur", "Belajar"];

  return (
    <div>
      <h3>Pilih Aktivitas:</h3>
      {options.map((item, index) => (
        <label key={index} style={{ display: "block" }}>
          <input
            type="radio"
            value={item}
            checked={pilihan === item}
            onChange={(e) => setPilihan(e.target.value)}
          />
          {item}
        </label>
      ))}
      <p>Aktivitas yang dipilih: {pilihan}</p>
    </div>
  );
}
export default NavbarZakat;
