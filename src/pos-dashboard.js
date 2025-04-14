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

function PosDashBoard(prop) {
  const { idPos, pengurusLength } = prop;
  const [loading, setLoading] = useState(true);
  const [dataPosZakat, setDataPosZakat] = useState([]);

  const DataWajibZakat = async (idpos) => {
    try {
      let dataPos = await findWajibZakat(`idPos=${idpos}`);
      setDataPosZakat(dataPos);
    } catch (error) {
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    DataWajibZakat(idPos);
  }, [idPos]);
  try {
    return (
      <>
        <div className="bg-white p-4 rounded-tr-lg rounded-b-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-800">Wajib Zakat</h2>
              <p className="text-4xl font-semibold text-blue-500 mt-2">
                {dataPosZakat.length}
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-800">
                Zakat Terkumpul
              </h2>
              <p className="text-4xl font-semibold text-green-500 mt-2">
                {
                  dataPosZakat.filter((data) =>
                    data.bayar[data.bayar.length - 1] === undefined
                      ? false
                      : data.bayar[data.bayar.length - 1].includes(
                          String(new Date().getFullYear()) + "=0"
                        )
                  ).length /*(() => {
                  try {
                    return dataPosZakat.filter((data) =>
                      data.bayar
                        .pop()
                        .includes(String(new Date().getFullYear()))
                    ).length;
                  } catch (error) {
                    return 0;
                  }
                })()*/
                }
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-800">
                Penerima Zakat
              </h2>
              <p className="text-4xl font-semibold text-yellow-500 mt-2">
                {dataPosZakat.filter((data) => data.penanggung && data.penerima)
                  .length + pengurusLength}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    if (loading) {
      console.log(error);
      setLoading(false);
    }
  }
}
export default PosDashBoard;
