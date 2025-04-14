import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
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

function TabelWajib(prop) {
  const { dataWajibZakat, idLink } = prop;
  const [dataSearch, setDataSearch] = useState([]);
  const [penerimaFilter, setPenerimaFilter] = useState(false);
  const [diterima, setDiterima] = useState([]);

  try {
    useEffect(() => {
      if (dataWajibZakat) {
        setDataSearch(dataWajibZakat);
      }
    }, [dataWajibZakat]); // Tambahkan dependensi

    const SearchNama = (event) => {
      const targetInp = event.currentTarget;
      const searcInp = targetInp.parentElement
        .closest(".search")
        .querySelectorAll("input");

      const searchTerm = event.currentTarget.value.trim();
      const filtIf = (trg, dt) => {
        if (trg.type === "text")
          return dt.namaWajib.toLowerCase().includes(trg.value.toLowerCase());
        if (trg.type === "checkbox") {
          return trg.checked ? dt.penerima : true;
        }
      };

      const arrId = [];
      dataWajibZakat[0].forEach((data) => {
        if (filtIf(searcInp[0], data) && filtIf(searcInp[1], data))
          arrId.push(data.idWajib.split("=")[0]);
      });
      dataWajibZakat[1].forEach((data) => {
        if (filtIf(searcInp[0], data) && filtIf(searcInp[1], data))
          arrId.push(data.idWajib.split("=")[0]);
      });
      const filterIds = [...new Set(arrId)];
      const filteredData = dataWajibZakat.map((group) =>
        group.filter((item) => filterIds.includes(item.idWajib.split("=")[0]))
      );
      const terimaChc = [];
      if (searcInp[1].checked) {
        filteredData[0].forEach((data) => {
          terimaChc.push(
            data.diterima === undefined || data.diterima === false
              ? false
              : true
          );
        });
        //console.log("fidis", terimaChc);
        setDiterima(terimaChc);
      }

      setDataSearch(filteredData);
    };

    const UpdateTerima = async (event, idx, id) => {
      const terimaCheck = diterima;
      terimaCheck[idx] = event.target.checked;

      try {
        dataWajibZakat[0].forEach((data) => {
          if (data.id === id) data.diterima = event.target.checked;
        });
        const sudahTerima = await updatePost(
          "wajibZakat",
          id,
          dataSearch[0].filter((data) => data.id === id)[0]
        );
        console.log("trima", sudahTerima);

        setDiterima(terimaCheck);
      } catch (error) {}
    };

    return (
      <>
        <div className="w-full p-4">
          <div className="mb-2 text-2xl font-bold">
            <h1>Data Wajib Zakat</h1>
          </div>
          <div className="search flex gap-[30px] items-center">
            <input
              className="w-96 mb-4 px-2 py-1 border border-gray-400 rounded-lg"
              onChange={SearchNama}
              placeholder="Cari Nama"
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    SearchNama(e);
                    setPenerimaFilter(e.target.checked);
                  }}
                />
                <span>Penerima Zakat</span>
              </label>
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">No.</th>
                <th className="border border-gray-400 px-4 py-2">Nama</th>
                <th className="border border-gray-400 px-4 py-2">Tanggungan</th>
                <th className="border border-gray-400 px-4 py-2">
                  Penerima Zakat
                </th>
                <th className="border border-gray-400 px-4 py-2">Edit Data</th>
              </tr>
            </thead>
            <tbody>
              {dataSearch[0].map((data, index) => {
                //if (data.namaWajib.toLowerCase().includes(searchNama))
                return (
                  <tr
                    key={index}
                    className={data.penerima ? "bg-emerald-200" : "bg-white"}
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {data.namaWajib}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {dataWajibZakat[1].filter((dataW) =>
                        dataW.idWajib.includes(data.idWajib.split("=")[0])
                      ).length < 1 ? (
                        "-"
                      ) : (
                        <ol className="px-4 list-decimal">
                          {dataSearch[1].map((dataTg, indexTg) => {
                            if (
                              dataTg.idWajib.includes(
                                data.idWajib.split("=")[0]
                              )
                            ) {
                              return <li key={indexTg}>{dataTg.namaWajib}</li>;
                            }
                          })}
                        </ol>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {data.penerima ? (
                        <>
                          <div>YA</div>
                          {penerimaFilter ? (
                            <label>
                              <input
                                type="checkbox"
                                checked={diterima[index]}
                                onChange={(e) => {
                                  UpdateTerima(e, index, data.id);
                                }}
                              />
                              <span>DITERIMA</span>
                            </label>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <div>BUKAN</div>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <a
                        className="w-full h-full block p-2 font-bold text-emerald-700 cursor-pointer hover:text-emerald-800 hover:underline"
                        href={`/pos/${encodeURIComponent(idLink)}/edit=${
                          data.idWajib.split("=")[0]
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={["fas", "fa-gear"]}
                          className="text-sm w-5"
                        />
                        <span>Edit</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  } catch (e) {
    return "error";
  }
}
export default TabelWajib;
