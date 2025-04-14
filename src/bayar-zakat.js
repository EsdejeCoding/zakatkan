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
import ResizeComponent from "./ResizeComponent ";

function BayarZakat(prop) {
  const { idLink, idEdit } = useParams();
  const { windowWidth, windowHeight } = ResizeComponent();
  const dataAkun = prop.data;
  const [dataPosZakat, setDataPosZakat] = useState([]);
  const [dataWajibZakat, setDataWajibZakat] = useState([]);
  const [dataSearchSelect, setDataSearchSelect] = useState([]);
  const [totalCheck, setTotalCheck] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchAct, setSearchAct] = useState("");
  const [searchNamaSelect, setSearchNamaSelect] = useState([]);
  const [statusBayarSini, setStatusBayarSini] = useState([]);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [penerimaCheck, setPenerimaCheck] = useState(false);
  const [confirmText, setConfirmText] = useState({
    head: "",
    body: "",
    button: ["", ""],
  });
  const [delDataAlert, setDelDataAlert] = useState(false);
  const [delDataId, setDelDataId] = useState(false);

  const DataValidate = async () => {
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
      setDataPosZakat(dataPos);
    } catch (error) {
    } finally {
      setLoading(true);
    }
  };

  const SearchNama = async (event) => {
    const searchTerm = event.currentTarget.value.trim();
    try {
      const getPenaggung = await findWajibZakat(
        `idPos=${
          dataPosZakat[0].id
        }&namaWajib_like=${searchTerm.toLowerCase()}&penanggung=true`
      );
      setSearchAct(searchTerm);
      setSearchNamaSelect(searchTerm);
      setDataWajibZakat(getPenaggung);
    } catch (error) {
    } finally {
    }
  };

  const SearchSelect = async (namaSelect, idSelect) => {
    setDataSearchSelect([]);
    try {
      const bayarCheck = [];
      const getDataSelect = await findWajibZakat(
        `idPos=${dataPosZakat[0].id}&idWajib_like=${idSelect}`
      );
      /**/ getDataSelect.forEach((data) => {
        if (String(data.bayar.pop()).includes(String(new Date().getFullYear())))
          bayarCheck.push(true);
      });
      setStatusBayarSini(bayarCheck);
      setSearchNamaSelect(namaSelect);
      setDataSearchSelect(getDataSelect);
    } catch (error) {
    } finally {
    }
  };

  const BayarCheck = (event, penanggung = true) => {
    const parentForm = event.currentTarget.parentElement.closest("form");
    const siniCheck = parentForm.querySelectorAll(".sini-check");
    if (penanggung) {
      if (event.currentTarget.checked) {
        siniCheck.forEach((elem, index) => {
          if (index > 0) elem.checked = true;
        });
        setTotalCheck(siniCheck.length);
      } else setTotalCheck((prev) => prev - 1);
    } else {
      let checkIdc = 0;
      siniCheck.forEach((elem, index) => {
        if (elem.checked) checkIdc++;
      });
      setTotalCheck(checkIdc);
    }

    //event.currentTarget.checked = true;
  };

  const SubmitBayar = async (event) => {
    event.preventDefault();
    try {
      const bayarOpt = event.currentTarget.querySelectorAll(".bayar-option");
      const tempatBayar = (el, tmp) => {
        return el.querySelector(`input.${tmp}-check`).checked;
      };
      const yearBayar = new Date().getFullYear() + "=";
      const stsBayar = [];
      const successBayar = [];
      bayarOpt.forEach(async (elem, index) => {
        stsBayar.push({
          ...dataSearchSelect[index],
          bayar: [
            (() => {
              if (tempatBayar(elem, "sini")) return yearBayar + "0";
              if (tempatBayar(elem, "lain")) return yearBayar + "1";
            })(),
          ],
        });
        const updateBayar = await updatePost(
          "wajibZakat",
          dataSearchSelect[index].id,
          {
            ...dataSearchSelect[index],
            bayar: [
              (() => {
                if (tempatBayar(elem, "sini")) return yearBayar + "0";
                if (tempatBayar(elem, "lain")) return yearBayar + "1";
              })(),
            ],
          }
        );
        successBayar.push(updateBayar);
      });
      setSuccessUpdate(!successBayar.includes(false));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    DataValidate();
  }, [loading, setLoading]);

  try {
    //console.log(dataPosZakat.length > 0, dataPosZakat);

    return (
      <>
        <div className="p-6">
          <div className="mb-2 text-2xl font-bold">
            <h1>Bayar Zakat</h1>
          </div>
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
          <div
            className={`w-96 mt-5 mb-20 relative`}
            style={{
              width: windowWidth < 400 || window.outerWidth < 400 ? "100%" : "",
            }}
          >
            <input
              className="w-full px-2 py-1 border border-gray-400 rounded-lg"
              value={searchNamaSelect}
              onChange={(e) => {
                SearchNama(e);
              }}
              placeholder="Cari Nama"
            />
            <div className="w-full bg-white rounded-lg shadow-md absolute z-[100]">
              {dataWajibZakat.length > 0 && searchAct.length > 0 ? (
                <div className="p-2">
                  <div>
                    Hasil pencarian: <b>{searchAct}</b>
                  </div>
                  {dataWajibZakat.map((data, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-200 p-1 cursor-pointer"
                      onClick={() => {
                        SearchSelect(
                          data.namaWajib,
                          data.idWajib.split("=")[0]
                        );
                        setSearchAct("");
                      }}
                    >
                      {data.namaWajib}
                    </div>
                  ))}
                </div>
              ) : searchAct.length > 0 ? (
                <div>
                  Tidak ditemukan pencarian "<b>{searchAct}</b>"
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {dataSearchSelect.length > 0 ? (
            <form
              style={{
                width:
                  window.outerWidth < 400
                    ? window.outerWidth - 48 + "px"
                    : "500px",
              }}
              onSubmit={SubmitBayar}
            >
              <div className="font-bold text-xl">
                Data Wajib Zakat {window.outerWidth}
              </div>
              {statusBayarSini.length < 1 ? (
                <>
                  <div>
                    <div className="font-bold text-lg">Penanggung: </div>
                    <div className="flex justify-between items-center">
                      <div className="capitalize p-1 w-1/2">
                        {dataSearchSelect[0].namaWajib}
                      </div>
                      <div className="bayar-option flex gap-[20px] w-1/2">
                        <label className="mr-5">
                          <input
                            type="checkbox"
                            className="sini-check mr-2"
                            onClick={(e) => {
                              BayarCheck(e);
                            }}
                            onChange={(e) => {
                              const checkInp = e.target;
                              checkInp.parentElement.nextSibling.firstChild.checked =
                                !checkInp.checked;
                            }}
                          />
                          <span>Di Sini</span>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            className="lain-check mr-2"
                            onChange={(e) => {
                              const checkInp = e.target;
                              checkInp.parentElement.previousSibling.firstChild.checked =
                                !checkInp.checked;
                            }}
                          />
                          <span>Tempat Lain</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Tanggungan: </div>
                    {dataSearchSelect.map((data, index) => {
                      if (index > 0)
                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div className="capitalize p-1 w-1/2">
                              {index}. {data.namaWajib}
                            </div>
                            <div className="bayar-option flex gap-[20px] w-1/2">
                              <label className="mr-5">
                                <input
                                  type="checkbox"
                                  className="sini-check mr-2"
                                  onClick={(e) => {
                                    BayarCheck(e, false);
                                  }}
                                  onChange={(e) => {
                                    const checkInp = e.target;
                                    checkInp.parentElement.nextSibling.firstChild.checked =
                                      !checkInp.checked;
                                  }}
                                />
                                <span>Di Sini</span>
                              </label>
                              <label>
                                <input
                                  type="checkbox"
                                  className="lain-check mr-2"
                                  onChange={(e) => {
                                    const checkInp = e.target;
                                    checkInp.parentElement.previousSibling.firstChild.checked =
                                      !checkInp.checked;
                                  }}
                                />
                                <span>Tempat Lain</span>
                              </label>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </>
              ) : (
                <div className="font-medium">
                  <p className="text-red-500">
                    Wajib Zakat sudah melakukan pembayaran!
                  </p>
                  <a
                    className="text-cyan-700"
                    href={`./edit=${dataSearchSelect[0].idWajib.split("=")[0]}`}
                  >
                    Anda ingin melakukan edit? Klik di sini
                  </a>
                </div>
              )}
              <div className="font-bold text-lg">
                Total Bayar Zakat: {totalCheck}
              </div>
              <button className="w-full h-12 px-5 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-lg mt-6">
                Tambah
              </button>
            </form>
          ) : (
            ""
          )}
        </div>
        {successUpdate ? (
          <>
            <div className="w-full h-screen bg-stone-950/25 fixed top-0 z-[0] flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <p className="text-gray-600 mb-6">
                  Berhasil Melakukan Pembayaran Zakat!
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setDataWajibZakat([]);
                      setDataSearchSelect([]);
                      setTotalCheck(0);
                      setSearchAct("");
                      setSearchNamaSelect([]);
                      setStatusBayarSini([]);
                      setSuccessUpdate(false);
                    }}
                    databtn="wajib"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-md"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    );
  } catch (error) {
    //console.log(error);
    return <div>Data tidak ditemukan</div>;
  }
}
export default BayarZakat;
