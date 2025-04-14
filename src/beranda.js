import React, { useEffect, useState } from "react";
import {
  createPost,
  getPosts,
  findPost,
  findPostDataPos,
  findAccountsBySkill,
  updateLogin,
} from "./data-server-handler.js";
import EnkripBaru from "./enkrip-baru.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PosDashBoard from "./pos-dashboard.js";

function Beranda(prop) {
  const [staffList, setStaffList] = useState([]);
  const [fetchData, setFetchData] = useState(true);
  const [dataPos, setDataPos] = useState([]);
  const [breakData, setBreakData] = useState(false);
  const [tabPos, setTabPos] = useState([0, "", 1]);

  const loading = prop.loading;
  const dataAkun = prop.data;

  let sideMenuList = [];
  if (dataAkun.type === "admin")
    sideMenuList = [
      {
        holder: "Bayar Zakat",
        keyData: "pos-bayar",
        href: "./bayar",
        typeElement: "a",
      },
      {
        holder: "Staff Zakat",
        href: "./add-staff",
        keyData: "staff",
        typeElement: "detail",
      },
      {
        holder: "Pos Zakat",
        href: "./add-pos",
        keyData: "pos",
        typeElement: "detail",
      },
    ];
  if (dataAkun.type === "staff")
    sideMenuList = [
      { holder: "Bayar Zakat", href: "./bayar", typeElement: "a" },
      {
        holder: "Data Wajib Zakat",
        href: "./wajib-zakat",
        typeElement: "detail",
      },
    ];

  const DataStaf = async () => {
    let findP = [];
    let posZakatData = [];
    try {
      findP = await findPost(
        dataAkun.username,
        dataAkun.password,
        dataAkun.email,
        true
      );
      if (dataAkun.type === "admin")
        posZakatData = await findPostDataPos(dataAkun.username);
      /**/ if (dataAkun.type === "staff") {
        const COBA = await findPostDataPos(
          dataAkun.username,
          dataAkun.type
        ).then((result) => {
          console.log("DAPOS:", result);
          posZakatData = result;
        });
      }
      /*const COBA = await findAccountsBySkill("sport").then((result) => {
        console.log("Akun dengan skill 'sport':", result);
      });*/
    } catch (e) {
      setTimeout(() => {
        setBreakData(true);
      }, 5000);
    } finally {
      setFetchData(findP === undefined);
    }
    if (!fetchData) {
      setStaffList(findP);
      setDataPos(posZakatData);
      if (posZakatData.length > 0)
        setTabPos([0, posZakatData[0].id, posZakatData[0].staff.length + 1]);
    }
  };
  if (!loading && fetchData && !breakData) DataStaf();

  //if (fetchData && (staffList === undefined || staffList === null))
  //useEffect(() => {
  //   DataStaf();
  // }, [fetchData, setFetchData]);

  //console.log("SIDEMENU", prop.sideMenu);
  if (!loading && dataAkun.statusConnect !== undefined) {
    //console.log("staflis", staffList);
    if (dataAkun.statusConnect)
      if (!fetchData && staffList.length < 1 && !breakData) DataStaf();
      else
        return (
          <>
            {(() => {
              //if (!fetchData && staffList.length < 1) DataStaf();
            })()}
            <div className="min-h-screen">
              {/* Sidebar */}
              <div className="flex h-screen">
                <aside
                  className="w-64 bg-gray-700 text-gray-100"
                  style={{ display: prop.sideMenu === 0 ? "unset" : "none" }}
                >
                  <div className="p-4 text-center text-2xl font-bold border-b border-gray-700">
                    Dashboard
                  </div>
                  <div className="mt-4">
                    <ul>
                      {sideMenuList.map((item, index) => {
                        if (dataAkun.type === "admin")
                          return (
                            <li key={index}>
                              <div className="block px-4 hover:bg-gray-600 cursor-pointer">
                                <details>
                                  <summary className="py-2.5">
                                    {item.holder}
                                  </summary>
                                  <ul>
                                    <li className="flex gap-1 items-center bg-gray-600 hover:bg-gray-500 p-1">
                                      <FontAwesomeIcon
                                        icon={["fas", "fa-plus"]}
                                        className="text-sm w-5"
                                      />
                                      <a href={item.href} className="w-full">
                                        Tambah
                                      </a>
                                    </li>
                                    {((keydata) => {
                                      const dataSrc =
                                        keydata === "staff"
                                          ? staffList
                                          : dataPos;
                                      const elemData = (key, datasrc) => {
                                        const dataFrom = {
                                          staff: {
                                            holder: datasrc.username,
                                            href: `./staff/${datasrc.username}`,
                                          },
                                          pos: {
                                            holder: datasrc.pos,
                                            href: `./pos/${encodeURIComponent(
                                              datasrc.pos + "/" + datasrc.id
                                            )}${
                                              key.includes("bayar")
                                                ? "/bayar"
                                                : ""
                                            }`,
                                          },
                                        };
                                        return dataFrom[
                                          key.includes("pos") ? "pos" : key
                                        ];
                                      };

                                      return dataSrc.map((elem, index) =>
                                        elem.type === "staff" ||
                                        keydata.includes("pos") ? (
                                          <li
                                            key={index}
                                            className="flex gap-2 items-center hover:bg-gray-500 p-1"
                                          >
                                            <FontAwesomeIcon
                                              icon={["fas", "fa-circle"]}
                                              className="text-sm w-1.5"
                                            />
                                            <a
                                              href={
                                                elemData(keydata, elem).href
                                              }
                                            >
                                              {elemData(keydata, elem).holder}
                                            </a>
                                          </li>
                                        ) : null
                                      );
                                    })(item.keyData)}
                                  </ul>
                                </details>
                              </div>
                            </li>
                          );
                        if (dataAkun.type === "staff")
                          return (
                            <li key={index}>
                              <div className="block px-4 hover:bg-gray-600 cursor-pointer">
                                {(() => {
                                  if (item.typeElement === "a")
                                    return (
                                      <a
                                        href={item.href}
                                        className="block w-full py-2.5"
                                      >
                                        {item.holder}
                                      </a>
                                    );
                                  if (item.typeElement === "detail")
                                    return (
                                      <details>
                                        <summary className="py-2.5">
                                          {item.holder}
                                        </summary>
                                        <ul>
                                          {dataPos.map((elem, index) => {
                                            return (
                                              <li
                                                key={index}
                                                className="flex gap-2 items-center hover:bg-gray-500 p-1"
                                              >
                                                <FontAwesomeIcon
                                                  icon={["fas", "fa-circle"]}
                                                  className="text-sm w-1.5"
                                                />
                                                <a
                                                  href={`./pos/${encodeURIComponent(
                                                    elem.pos + "/" + elem.id
                                                  )}`}
                                                >
                                                  {elem.pos}
                                                </a>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </details>
                                    );
                                })()}
                              </div>
                            </li>
                          );
                      })}

                      <li>
                        <a
                          href="#"
                          className="block py-2.5 px-4 hover:bg-gray-600"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block py-2.5 px-4 hover:bg-gray-600"
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </aside>
                {/* Main Content */}
                <main className="flex-1 p-6">
                  <header className="bg-white p-4 rounded-lg shadow mb-6">
                    <h1 className="text-xl font-bold text-gray-800">
                      Selamat datang, {dataAkun.username}
                    </h1>
                  </header>
                  {/* Cards Section */}
                  <>
                    <div className="flex">
                      {dataPos.map((data, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className={`${
                                tabPos[0] === index
                                  ? "bg-white min-w-44 cursor-default"
                                  : "bg-gray-200 w-24 truncate hover:overflow-visible cursor-pointer"
                              } px-4 pt-2 rounded-t-lg font-bold shadow-[0_-0.75px_1px_rgba(0,0,0,0.25)]`}
                              onClick={() => {
                                setTabPos([
                                  index,
                                  data.id,
                                  data.staff.length + 1,
                                ]);
                              }}
                            >
                              {data.pos}
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <PosDashBoard
                      idPos={tabPos[1]}
                      pengurusLength={tabPos[2]}
                    />
                  </>
                  {/* Table Section */}
                  <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                      Aktifitas
                    </h2>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4">Tanggal</th>
                          <th className="py-2 px-4">Nama</th>
                          <th className="py-2 px-4">Pos</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-4">2025-01-24</td>
                          <td className="py-2 px-4">User logged in</td>
                          <td className="py-2 px-4 text-green-500">Success</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-4">2025-01-23</td>
                          <td className="py-2 px-4">Payment processed</td>
                          <td className="py-2 px-4 text-green-500">Success</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">2025-01-22</td>
                          <td className="py-2 px-4">User signed up</td>
                          <td className="py-2 px-4 text-green-500">Success</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </main>
              </div>
            </div>
          </>
        );
    if (dataAkun.statusConnect === false) {
      localStorage.clear();
      window.location.href = "./login";
    }
  }
}

export default Beranda;
