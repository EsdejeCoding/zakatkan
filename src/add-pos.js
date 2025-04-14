import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  createPost,
  getPosts,
  findPost,
  updateLogin,
} from "./data-server-handler.js";

function AddPos(prop) {
  const [dataInput, setDataInput] = useState({});
  const [staffSelect, setStaffSelect] = useState([]);
  const [fullStaff, setFullStaff] = useState(5);
  const [successAdd, setSuccessAdd] = useState(false);

  const ClassStyle = (event) => {
    const classLabel = event.currentTarget.children[0].classList;
    const formInput = event.currentTarget.children[1].firstElementChild;

    const classList = {
      default: ["text-gray-400", "m-2"],
      event: {
        wraper: ["border-2", "border-emerald-500"],
        label: [
          "transition-all",
          "translate-x-1",
          "bottom-9",
          "text-emerald-700",
          "border-b-8",
          "border-white",
        ],
      },
    };
    if (formInput.value.length < 1) {
      if (event.type === "click") {
        event.currentTarget.classList.add(...classList.event.wraper);
        classLabel.remove(...classList.default);
        classLabel.add(...["mx-3", "my-2"]);
        classLabel.add(...classList.event.label);
        formInput.focus();
      }
      if (event.type === "blur") {
        event.currentTarget.classList.remove(...classList.event.wraper);
        classLabel.add(...classList.default);
        classLabel.remove(...["mx-3", "my-2"]);
        classLabel.remove(...classList.event.label);
      }
    }
  };

  const InputHandler = (event) => {
    const { type, checked, value } = event.currentTarget;

    if (type === "text")
      setDataInput((prev) => ({
        ...prev,
        admin: prop.dataStaff[0].username,
        pos: value,
      }));

    if (type === "checkbox") {
      if (checked) setStaffSelect([...staffSelect, value]);
      else setStaffSelect(staffSelect.filter((item) => item !== value));
    }
  };

  const SubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const createData = await createPost(
        {
          ...dataInput,
          staff:
            staffSelect.length < 1 ? [prop.dataStaff[0].username] : staffSelect,
        },
        "data"
      );
    } catch (e) {
    } finally {
      setSuccessAdd(true);
    }
  };

  const ShowFull = (event) => {
    setFullStaff(prop.dataStaff.length);
    event.currentTarget.children[0].remove();
  };

  const AddPosConfirm = (event) => {
    if (event.currentTarget.attributes[0].value === "wajib")
      window.location.href = "./wajib-zakat";
    if (event.currentTarget.attributes[0].value === "done")
      window.location.href = "./";
  };

  try {
    if (prop.type !== "staff")
      return (
        <>
          <div className="h-screen">
            <main className="h-5/6 flex  justify-center items-center p-4">
              <div className="w-96 m-4">
                <div className="mb-10">
                  <h1 className="mb-2 text-2xl font-bold">
                    Tambahkan Pos Zakat
                  </h1>
                  <p>Silahkan daftarkan pos Zakat anda.</p>
                </div>
                <form onSubmit={SubmitHandler}>
                  <div className="min-h-24 flex flex-col gap-[20px] justify-between">
                    <div>
                      <div
                        className="username-input-wrap relative rounded-lg"
                        onClick={ClassStyle}
                        onBlur={ClassStyle}
                      >
                        <label className="text-gray-400 leading-5 h-8 m-2 p-2 absolute capitalize">
                          Nama Pos
                        </label>
                        <div className="border border-gray-400 w-full hover:border-gray-950 rounded-lg">
                          <input
                            className="w-full py-3 px-2 outline-none rounded-lg"
                            id="pos"
                            type="text"
                            required
                            onChange={InputHandler}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>Tambah Staff Pengurus :</div>
                      <div>
                        <ul className="p-2">
                          {prop.dataStaff.map((item, index) => {
                            if (index > 0 && index < fullStaff)
                              return (
                                <li key={index}>
                                  <label className="flex gap-[10px]">
                                    <input
                                      type="checkbox"
                                      value={item.username}
                                      onChange={InputHandler}
                                    />
                                    <span>{item.username}</span>
                                  </label>
                                </li>
                              );
                          })}
                        </ul>
                        {(() => {
                          if (prop.dataStaff.length > 5)
                            return (
                              <div
                                className="w-6 h-6 text-gray-500 hover:text-gray-900 cursor-pointer rounded-full mx-auto mt-2 text-center"
                                onClick={ShowFull}
                              >
                                <FontAwesomeIcon
                                  className=""
                                  icon={["fas", "fa-angles-down"]}
                                />
                              </div>
                            );
                        })()}
                      </div>
                    </div>
                  </div>
                  <button className="w-full h-12 px-5 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-lg mt-6">
                    Tambah
                  </button>
                </form>
              </div>
            </main>
            {successAdd ? (
              <>
                <div className="w-full h-screen bg-stone-950/25 fixed top-0 z-[0] flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                    <p className="text-gray-600 mb-6">
                      Berhasil menambahkan Pos Zakat!
                    </p>
                    <p className="text-gray-600 mb-6">
                      Tambah data wajib zakat?
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={AddPosConfirm}
                        databtn="wajib"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-md"
                      >
                        Tambah Lagi
                      </button>
                      <button
                        onClick={AddPosConfirm}
                        databtn="done"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </>
      );
    else window.location.href = "./";
  } catch (e) {
    return <div>err</div>;
  }
}
export default AddPos;
