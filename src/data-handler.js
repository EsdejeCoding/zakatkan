import React, { useEffect, useState } from "react";
import axios from "axios";

function DataHandler(prop) {
  const linkData = "http://localhost:3001/data";
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [dataInput, setDataInput] = useState({
    email: null,
    password: null,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(linkData);
      setItems(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post(linkData, dataInput);
      setItems([...items, response.data]);
      setName("");
    } catch (error) {
      console.error("There was an error adding the item!", error);
    }
  };

  const updateItem = async (id) => {
    try {
      const response = await axios.put(`${linkData}/${id}`, { name });
      setItems(items.map((item) => (item.id === id ? response.data : item)));
      setName("");
      setEditId(null);
    } catch (error) {
      console.error("There was an error updating the item!", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${linkData}/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("There was an error deleting the item!", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateItem(editId);
    } else {
      addItem();
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="imel"
          onChange={(e) =>
            setDataInput((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
        />
        <input
          placeholder="paswod"
          onChange={(e) =>
            setDataInput((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <button>login</button>
      </form>
      {/*`<div className="App">
      <h1>CRUD App with json-server</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button
              onClick={() => {
                setName(item.name);
                setEditId(item.id);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>`*/}
    </>
  );
}
export default DataHandler;
