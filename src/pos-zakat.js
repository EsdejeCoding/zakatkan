import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createPost,
  getPosts,
  findPost,
  findWajibZakat,
  findPostDataPos,
  findAccountsBySkill,
  updateLogin,
  updatePost,
  deletePost,
} from "./data-server-handler.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TabelWajib from "./tabel-wajib.js";

let indexTable = 0;
let successDel = undefined;

function PosZakat(prop) {
  const { idLink, idEdit } = useParams();
  const dataAkun = prop.data;
  const [dataPosZakat, setDataPosZakat] = useState([]);
  const [dataWajibZakat, setDataWajibZakat] = useState([]);
  const [valueInput, setValueInput] = useState([]);
  const [idDataInput, setidDataInput] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedAct, setEditedAct] = useState(false);
  const [deleteEdit, setDeleteEdit] = useState(false);
  const [penerimaCheck, setPenerimaCheck] = useState(false);
  const [tanggungInp, setTanggungInp] = useState([]);
  const [successAdd, setSuccessAdd] = useState(false);
  const [confirmText, setConfirmText] = useState({
    head: "",
    body: "",
    button: ["", ""],
  });
  const [delDataAlert, setDelDataAlert] = useState(false);
  const [delDataId, setDelDataId] = useState(false);
  const [bayarCheck, setBayarCheck] = useState([]);

  const GetDataPos = async () => {
    try {
      let dataPos = "";
      if (dataAkun.type === "admin")
        dataPos = await findPostDataPos(
          `id=${idLink.split("/").pop()}&admin=${dataAkun.username}`,
          "BYQUERIES"
        );
      if (dataAkun.type === "staff")
        dataPos = await findPostDataPos(
          `id=${idLink.split("/").pop()}&staff=${dataAkun.username}`,
          "BYQUERIES"
        );
      //findWajibZakat
      //console.log(dataPos);
      setDataPosZakat(dataPos);

      if (dataPos.length > 0) {
        if (!prop.edit) {
          let getPenaggung = await findWajibZakat(
            `idPos=${dataPos[0].id}&penanggung=true`
          );
          let getTanggungan = await findWajibZakat(
            `idPos=${dataPos[0].id}&penanggung=false`
          );
          setDataWajibZakat([getPenaggung.reverse(), getTanggungan]);
          setPenerimaCheck(prop.edit);
        } else {
          let getDataWajibEdit = await findWajibZakat(
            `idPos=${dataPos[0].id}&idWajib_like=${idEdit.split("=").pop()}`
          );
          setDataWajibZakat(getDataWajibEdit);

          const addIdData = [];
          const addNamaWajib = [];
          const addTanggungan = [];
          const bayarHist = (dt, ps = "") => {
            /*console.log(
              "bayr" + ps,
              dt.bayar[dt.bayar.length - 1].includes(
                String(new Date().getFullYear())
              )
            );
           */ return dt.bayar.length === 0
              ? false
              : dt.bayar[dt.bayar.length - 1].includes(
                  String(new Date().getFullYear() + ps)
                );
          };
          const tempatBayar = [];
          getDataWajibEdit.forEach((data, index) => {
            addIdData.push(data.id);
            addNamaWajib.push(data.namaWajib);
            if (bayarHist(data)) {
              tempatBayar.push([bayarHist(data, "=0"), bayarHist(data, "=1")]);
            } else tempatBayar.push([false, false]); /*console.log(
              "TMPB",
              //String(data.bayar.pop()).includes(String(new Date().getFullYear()))
              bayarHist(data, "=1")
            );*/
            //console.log(window.document.querySelector("form .edit-person"));
          });
          setidDataInput(addIdData);
          setValueInput(addNamaWajib);
          setTanggungInp(addTanggungan);
          setPenerimaCheck(prop.edit && getDataWajibEdit[0].penerima);
          setBayarCheck(tempatBayar);
          console.log("TMPB", tempatBayar);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

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
        //console.log(event.currentTarget.classList);
      }
      if (event.type === "blur") {
        event.currentTarget.classList.remove(...classList.event.wraper);
        classLabel.add(...classList.default);
        classLabel.remove(...["mx-3", "my-2"]);
        classLabel.remove(...classList.event.label);
      }
    }
  };

  const InputHandler = (event) => {};

  const SubmitHandler = async (event) => {
    event.preventDefault();
    const inputElem = event.currentTarget.children[0];
    const penanggungPrs = inputElem.querySelector("#penanggung").value;
    const penerimaZakat = inputElem.querySelector("#penerima").checked;
    const tanggunganPrs = inputElem.querySelectorAll(".tanggungan-person");
    const idWajib = new Date().getTime();
    //const { value } =tanggunganPrs
    try {
      if (!prop.edit) {
        const addPenanggung = await createPost(
          {
            idPos: idLink.split("/").pop(),
            idWajib: `${idWajib}=0`,
            namaWajib: penanggungPrs.trim(),
            penanggung: true,
            bayar: [],
            penerima: penerimaZakat,
          },
          "wajibZakat"
        );

        tanggunganPrs.forEach(async (el, index) => {
          const addTanggungan = await createPost(
            {
              idPos: idLink.split("/").pop(),
              idWajib: `${idWajib}=${index + 1}`,
              namaWajib: el.value.trim(),
              penanggung: false,
              bayar: [],
              penerima: penerimaZakat,
            },
            "wajibZakat"
          );
        });
      } else {
        const yearBayar = new Date().getFullYear() + "=";
        const bayarOpt = event.currentTarget.querySelectorAll(".bayar-option");
        const tempatBayar = (el, tmp) => {
          return el.querySelector(`input.${tmp}-check`).checked;
        };
        const tanggunganEdit = inputElem.querySelectorAll(".edit-person");
        if (deleteEdit && !editedAct)
          window.location.href = "./" + encodeURIComponent(idLink);
        if (editedAct) {
          /**/ const editDataPenanggung = await updatePost(
            "wajibZakat",
            dataWajibZakat[0].id,
            {
              id: dataWajibZakat[0].id,
              idPos: idLink.split("/").pop(),
              idWajib: `${idEdit.split("=").pop()}=0`,
              namaWajib: penanggungPrs.trim(),
              penanggung: true,
              bayar:
                !tempatBayar(bayarOpt[0], "sini") &&
                !tempatBayar(bayarOpt[0], "lain")
                  ? []
                  : [
                      (() => {
                        if (tempatBayar(bayarOpt[0], "sini"))
                          return yearBayar + "0";
                        if (tempatBayar(bayarOpt[0], "lain"))
                          return yearBayar + "1";
                      })(),
                    ],
              penerima: penerimaZakat,
            }
          );
          tanggunganEdit.forEach(async (el, index) => {
            const editDataTanggungan = await updatePost("wajibZakat", el.id, {
              id: el.id,
              idPos: idLink.split("/").pop(),
              idWajib: `${idEdit.split("=").pop()}=${index + 1}`,
              namaWajib: el.value.trim(),
              penanggung: false,
              bayar:
                !tempatBayar(bayarOpt[index + 1], "sini") &&
                !tempatBayar(bayarOpt[index + 1], "lain")
                  ? []
                  : [
                      (() => {
                        if (tempatBayar(bayarOpt[index + 1], "sini"))
                          return yearBayar + "0";
                        if (tempatBayar(bayarOpt[index + 1], "lain"))
                          return yearBayar + "1";
                      })(),
                    ],
              penerima: penerimaZakat,
            });
          });
          tanggunganPrs.forEach(async (el, index) => {
            const editDataTanggungan = await createPost(
              {
                idPos: idLink.split("/").pop(),
                idWajib: `${idEdit.split("=").pop()}=${valueInput.length}`,
                namaWajib: el.value.trim(),
                penanggung: false,
                bayar: [],
                penerima: penerimaZakat,
              },
              "wajibZakat"
            );
          });
        }
      }
    } catch (e) {
    } finally {
      setConfirmText({
        head: "Berhasil Menambahkan Data Wajib Zakat!",
        body: "Tambah data Wajib Zakat?",
        button: ["Tambah Lagi", "Selesai"],
      });
      setSuccessAdd(true);
    }
    /*let dataWajib = [
      {
        pos: idLink.split("/").pop(),
        idWajib: `${new Date().getTime()}=0`,
        namaWajib: penanggungPrs,
        penanggung: true,
        bayar: [false],
        penerima: penerimaZakat,
      },
    ];
    
    console.log(dataWajib);*/
  };

  const AddTanggungan = () => {
    setTanggungInp([
      ...tanggungInp,
      <div className="tanggungan-wrap" key={tanggungInp.length + 1}>
        <div
          className="relative rounded-lg"
          onClick={ClassStyle}
          onBlur={ClassStyle}
        >
          <label className="text-gray-400 leading-5 h-8 m-2 p-2 absolute capitalize">
            Tanggungan
          </label>
          <div className="flex items-center border border-gray-400 w-full hover:border-gray-950 rounded-lg">
            <input
              className="tanggungan-person w-full py-3 px-2 capitalize outline-none rounded-lg"
              type="text"
              onChange={setEditedAct(true)}
              required
            />
            <label className="p-2 leading-4 hover:bg-slate-200 hover:rounded-full bg-white">
              <input
                className="hidden"
                type="checkbox"
                onChange={DelTanggungan}
              />
              <FontAwesomeIcon
                icon={["fas", "xmark"]}
                className="text-gray-500 text-xl"
              />
            </label>
          </div>
        </div>
      </div>,
    ]);
  };

  const DelTanggungan = (event, index = false) => {
    if (prop.edit) {
      setConfirmText({
        head: "Hapus Data Wajib Zakat",
        body: "Apakah anda yakin menghapus data?",
        button: ["Ya", "Tidak"],
      });
      setDelDataAlert(true);

      if (index !== false) setDelDataId(index);
      /**/ if (index === false)
        event.currentTarget.parentElement.closest(".tanggungan-wrap").remove();
    } else {
      event.currentTarget.parentElement.closest(".tanggungan-wrap").remove();
    }
  };

  const AddPosConfirm = (event) => {
    if (event.currentTarget.attributes[0].value === "wajib")
      window.location.href = prop.edit
        ? "./"
        : "./" + encodeURIComponent(idLink);
    if (event.currentTarget.attributes[0].value === "done")
      window.location.href = "/";
  };

  const DeleteData = async (event) => {
    //setDeleData(false);
    try {
      if (delDataId !== false) {
        let filterData = dataWajibZakat;
        NewDataLoad(
          filterData.filter((data) => data.id !== idDataInput[delDataId])
        );
        /**/ const delDataWajibZakat = await deletePost(
          "wajibZakat?id=" + idDataInput[delDataId]
        );
        setDelDataAlert(!delDataWajibZakat);
        setSuccessAdd(delDataWajibZakat);
        setValueInput(valueInput.filter((_, i) => i !== delDataId));
        setidDataInput(idDataInput.filter((_, i) => i !== delDataId));
      } else {
        try {
          dataWajibZakat.forEach(async (data) => {
            indexTable++;
            const delDataWajibZakat = await deletePost(
              "wajibZakat?id=" + data.id
            );
          });
          successDel = true;
        } catch (error) {
          successDel = false;
        }
        setDelDataAlert(!successDel);
        setSuccessAdd(successDel);
        console.log(
          "successDel" + indexTable,
          successDel + " " + dataWajibZakat.length
        );
      }
    } catch (error) {
    } finally {
      setConfirmText({
        head: "Berhasil Menghapus Data Wajib Zakat!",
        body: "Tambah data Wajib Zakat?",
        button: ["Tambah Lagi", "Selesai"],
      });
    }
    //if (delDataId === false) setSuccessAdd(true);
  };
  const NewDataLoad = async (v) => {
    try {
      v.forEach(async (data, index) => {
        const editDataTanggungan = await updatePost("wajibZakat", data.id, {
          ...data,
          penanggung: index === 0,
          idWajib: `${idEdit.split("=").pop()}=${index}`,
        });
        /* console.log({
          ...data,
          idWajib: `${idEdit.split("=").pop()}=${index}`,
        });*/
      });
    } catch (error) {
    } finally {
    }
    console.log("nyudatalod", v);
  };
  useEffect(() => {
    GetDataPos();
  }, [loading, setLoading]);

  // console.log(dataPosZakat);
  try {
    return (
      <>
        <div className="h-screen">
          <main className="p-4">
            <div className="w-96 mx-auto m-4">
              <div className="mb-10">
                <h1 className="mb-2 text-2xl font-bold">
                  {prop.edit ? "Edit" : "Tambah"} Data Wajib Zakat
                </h1>
                <div>
                  <h2>
                    Pos: <b>{dataPosZakat[0].pos}</b>
                  </h2>
                  <h3>
                    Admin: <b>{dataPosZakat[0].admin}</b>
                  </h3>
                  <h3>
                    Pengurus: <b>{dataAkun.username}</b>
                  </h3>
                </div>
              </div>
              <form onSubmit={SubmitHandler}>
                <div className="min-h-24 flex flex-col gap-[20px] justify-between">
                  <div>
                    <div
                      className={`username-input-wrap relative rounded-lg ${
                        prop.edit ? "border-2 border-emerald-500" : ""
                      }`}
                      onClick={ClassStyle}
                      onBlur={ClassStyle}
                    >
                      <label
                        className={`leading-5 h-8 p-2 absolute capitalize ${
                          prop.edit
                            ? "mx-3 my-2 transition-all translate-x-1 bottom-9 text-emerald-700 border-b-8 border-white"
                            : "text-gray-400 m-2"
                        }`}
                      >
                        Penanggung
                      </label>
                      <div className="flex items-center border border-gray-400 w-full hover:border-gray-950 rounded-lg">
                        <input
                          className="w-full py-3 px-2 outline-none rounded-lg capitalize"
                          id="penanggung"
                          type="text"
                          onChange={(e) => {
                            let newInput = [...valueInput];
                            newInput[0] = e.target.value;
                            setValueInput(newInput);
                            setEditedAct(true);
                          }}
                          value={valueInput[0]}
                          required
                        />
                        {prop.edit ? (
                          <label className="p-2 leading-4 hover:bg-slate-200 hover:rounded-full bg-white">
                            <input
                              className="hidden"
                              type="checkbox"
                              onChange={(e) => {
                                DelTanggungan(e, 0);
                                setDeleteEdit(true);
                              }}
                            />
                            <FontAwesomeIcon
                              icon={["fas", "xmark"]}
                              className="text-gray-500 text-xl"
                            />
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex gap-[10px]">
                      <input
                        id="penerima"
                        type="checkbox"
                        onChange={(e) => {
                          setEditedAct(true);
                          setPenerimaCheck(!penerimaCheck);
                        }}
                        checked={penerimaCheck}
                      />
                      <span>Penerima Zakat</span>
                    </label>
                  </div>
                  <div>
                    {prop.edit ? (
                      <>
                        <div className="bayar-option flex gap-[20px] w-full">
                          <label className="mr-5">
                            <input
                              type="checkbox"
                              className="sini-check mr-2"
                              checked={bayarCheck[0][0]}
                              onChange={(e) => {
                                const checkInp = e.target;
                                const checkBayarCG = bayarCheck;
                                if (
                                  !checkBayarCG[0][0] &&
                                  !checkBayarCG[0][1]
                                ) {
                                  checkBayarCG[0][0] = true;
                                  checkBayarCG[0][1] = false;
                                } else {
                                  checkBayarCG[0][0] = !checkBayarCG[0][0];
                                  checkBayarCG[0][1] = !checkBayarCG[0][1];
                                }
                                setBayarCheck(checkBayarCG);
                                setEditedAct(true);
                              }}
                            />
                            <span>Bayar Di Sini</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              className="lain-check mr-2"
                              checked={bayarCheck[0][1]}
                              onChange={(e) => {
                                const checkInp = e.target;
                                const checkBayarCG = bayarCheck;
                                if (
                                  !checkBayarCG[0][0] &&
                                  !checkBayarCG[0][1]
                                ) {
                                  checkBayarCG[0][0] = false;
                                  checkBayarCG[0][1] = true;
                                } else {
                                  checkBayarCG[0][0] = !checkBayarCG[0][0];
                                  checkBayarCG[0][1] = !checkBayarCG[0][1];
                                }
                                setBayarCheck(checkBayarCG);
                                setEditedAct(true);
                              }}
                            />
                            <span>Bayar Tempat Lain</span>
                          </label>
                        </div>
                        <hr className="border-1 border-black" />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  {valueInput.slice(1).map((item, index) => (
                    <div className="edit-data" key={index + 1}>
                      <div
                        className={`username-input-wrap relative rounded-lg ${
                          prop.edit ? "border-2 border-emerald-500" : ""
                        }`}
                        onClick={ClassStyle}
                        onBlur={ClassStyle}
                      >
                        <label
                          className={`leading-5 h-8 p-2 absolute capitalize ${
                            prop.edit
                              ? "mx-3 my-2 transition-all translate-x-1 bottom-9 text-emerald-700 border-b-8 border-white"
                              : "text-gray-400 m-2"
                          }`}
                        >
                          Tanggungan
                        </label>
                        <div className="flex items-center border border-gray-400 w-full hover:border-gray-950 rounded-lg">
                          <input
                            id={idDataInput[index + 1]}
                            value={item}
                            onChange={(e) => {
                              const newNama = [...valueInput];
                              newNama[index + 1] = e.target.value;
                              setValueInput(newNama);
                              setEditedAct(true);
                            }}
                            className="edit-person w-full py-3 px-2 outline-none capitalize rounded-lg"
                            type="text"
                            required
                          />
                          <label className="p-2 leading-4 hover:bg-slate-200 hover:rounded-full bg-white">
                            <input
                              className="hidden"
                              type="checkbox"
                              onChange={(e) => {
                                DelTanggungan(e, index + 1);
                                setDeleteEdit(true);
                              }}
                            />
                            <FontAwesomeIcon
                              icon={["fas", "xmark"]}
                              className="text-gray-500 text-xl"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="bayar-option flex gap-[20px] w-full mb-5">
                        <label className="mr-5">
                          <input
                            type="checkbox"
                            className="sini-check mr-2"
                            checked={bayarCheck[index + 1][0]}
                            onChange={(e) => {
                              const checkBayarCG = bayarCheck;

                              if (
                                !checkBayarCG[index + 1][0] &&
                                !checkBayarCG[index + 1][1]
                              ) {
                                checkBayarCG[index + 1][0] = true;
                                checkBayarCG[index + 1][1] = false;
                              } else {
                                checkBayarCG[index + 1][0] =
                                  !checkBayarCG[index + 1][0];
                                checkBayarCG[index + 1][1] =
                                  !checkBayarCG[index + 1][1];
                              }
                              setBayarCheck(checkBayarCG);
                              setEditedAct(true);
                            }}
                          />
                          <span>Bayar Di Sini</span>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            className="lain-check mr-2"
                            checked={bayarCheck[index + 1][1]}
                            onChange={(e) => {
                              const checkBayarCG = bayarCheck;
                              if (
                                !checkBayarCG[index + 1][0] &&
                                !checkBayarCG[index + 1][1]
                              ) {
                                checkBayarCG[index + 1][0] = false;
                                checkBayarCG[index + 1][1] = true;
                              } else {
                                checkBayarCG[index + 1][0] =
                                  !checkBayarCG[index + 1][0];
                                checkBayarCG[index + 1][1] =
                                  !checkBayarCG[index + 1][1];
                              }
                              setBayarCheck(checkBayarCG);
                              setEditedAct(true);
                            }}
                          />
                          <span>Bayar Tempat Lain</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={AddTanggungan}
                    className="flex gap-[10px] items-center text-cyan-600 hover:text-cyan-800 py-1 hover:underline font-bold cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "fa-plus"]}
                      className="text-sm w-5"
                    />
                    <div className="w-full">Tambah Tanggungan</div>
                  </div>
                  {Object.values(tanggungInp)}
                </div>
                <div className="flex justify-between gap-[20px]">
                  {prop.edit ? (
                    <>
                      <a
                        className="flex flex-col items-center justify-center w-full h-12 px-5 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-lg mt-6 cursor-pointer"
                        href="./"
                      >
                        <div>Batal</div>
                      </a>
                      <div
                        className="flex flex-col items-center justify-center w-full h-12 px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg mt-6 cursor-pointer"
                        onClick={() => {
                          setConfirmText({
                            head: "Hapus Data Wajib Zakat",
                            body: "Apakah anda yakin menghapus data?",
                            button: ["Ya", "Tidak"],
                          });
                          setDelDataAlert(true);
                          setDelDataId(false);
                        }}
                      >
                        <div>Hapus</div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <button
                    className={`w-full h-12 px-5 py-2 bg-${
                      !editedAct ? "gray" : "emerald"
                    }-500 hover:bg-emerald-700 text-white rounded-lg mt-6`}
                    disabled={!editedAct}
                  >
                    {prop.edit ? "Simpan" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
            <hr />
            {(() => {
              if (!prop.edit) {
                return (
                  <TabelWajib dataWajibZakat={dataWajibZakat} idLink={idLink} />
                );
              }
            })()}
          </main>
          {successAdd || delDataAlert ? (
            <>
              <div className="w-full h-screen bg-stone-950/25 fixed top-0 z-[0] flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <p className="text-gray-600 mb-6">{confirmText.head}</p>
                  <p className="text-gray-600 mb-6">{confirmText.body}</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={(e) => {
                        if (successAdd) AddPosConfirm(e);
                        if (delDataAlert) DeleteData(e);
                      }}
                      databtn="wajib"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-md"
                    >
                      {confirmText.button[0]}
                    </button>
                    <button
                      onClick={(e) => {
                        if (successAdd) AddPosConfirm(e);
                        if (delDataAlert) {
                          setDelDataAlert(false);
                        }
                      }}
                      databtn="done"
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      {confirmText.button[1]}
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
  } catch (error) {
    console.log(error);
    return <div>Data tidak ditemukan</div>;
  }
}
export default PosZakat;
