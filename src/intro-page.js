import React, { useEffect, useState } from "react";
import {
  createPost,
  getPosts,
  findPost,
  updateLogin,
} from "./data-server-handler.js";
import EnkripBaru from "./enkrip-baru.js";
import Beranda from "./beranda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form_Login_Signup from "./form-login-signup.js";
import ResizeComponent from "./ResizeComponent ";
import AddPos from "./add-pos.js";
import PosZakat from "./pos-zakat.js";
import BayarZakat from "./bayar-zakat.js";

const localKey = localStorage.key(0);
const getLocalData = JSON.parse(localStorage.getItem(localKey));
const getDataInfo =
  (typeof Storage === "undefined" ? 0 : localStorage.length) < 1
    ? [null, null, null]
    : EnkripBaru({
        idLogin: getLocalData.id,
        enkripsi: getLocalData.token,
      });

let ind = 0;
function IntroPage(prop) {
  const { windowWidth, windowHeight } = ResizeComponent();

  const [fetch, setFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataAkun, setDataAkun] = useState({ statusConnect: false });
  const [dataStaff, setDataStaff] = useState({});
  const [avaClr, setAvaClr] = useState("0,0,0");
  const [profileIcoClick, setProfileIcoClick] = useState(0);
  const [sideMenuClick, setSideMenuClick] = useState(
    windowWidth <= 500 ? 1 : 0
  );
  const [logOutAlertHandler, setLogOutAlertHandler] = useState(false);
  const [logOutTrue, setLogOutTrue] = useState(false);
  const [dotLoad, setDotLoad] = useState("");

  const menuElemen = {
    ico: [
      "fa-person",
      "award",
      "user-group",
      "briefcase",
      "gear",
      "fa-right-from-bracket",
    ],
    elemHolder: [
      dataAkun.username,
      dataAkun.type,
      dataAkun.type === "admin" ? "Daftar Staf" : "Info Ketua",
      dataAkun.type === "admin" ? "Daftar Pos" : "Info Pos",
      "Pengaturan",
      "Keluar",
    ],
  };

  const DataCheck = async () => {
    if (
      fetch &&
      (typeof Storage === "undefined" ? 0 : localStorage.length) > 0
    ) {
      try {
        setLoading(true);
        const loginPost = await findPost(getDataInfo[1], getDataInfo[2]);
        const findP = await findPost(
          loginPost.username,
          loginPost.password,
          loginPost.email,
          true
        );
        setDataAkun(loginPost);
        setDataStaff(findP);
        const bgColor = (color) => {
          let idLog = String(loginPost.idLogin);
          const clrObj = { r: 3, g: 6, b: 9 };
          const clr = clrObj[color];
          //console.log("AVA", parseInt(idLog.substring(clr - 3, clr)));
          return parseInt(idLog.substring(clr - 3, clr)) % 180;
        };
        setAvaClr(`${bgColor("r")},${bgColor("g")},${bgColor("b")}`);
      } catch (err) {
        setTimeout(() => {
          setLoading(false);
          setDataAkun((prevState) => ({
            ...prevState,
            statusConnect: false,
          }));
        }, 5000);
        console.error("Error GET post:", err);
      } finally {
        setLoading(false);
      }
      setFetch(false);
    }
  };

  let profileIdc = 0;
  const profileIcon = () => {
    profileIdc = profileIcoClick;
    profileIdc++;
    //profileIdc = 0;
    setProfileIcoClick(profileIdc % 2);
    //profileIdc = 0
  };

  let sideMenuIdc = 0;
  const sideMenuToggle = () => {
    sideMenuIdc = sideMenuClick;
    sideMenuIdc++;
    //profileIdc = 0;
    setSideMenuClick(sideMenuIdc % 2);
    //profileIdc = 0
  };

  const settingAccount = () => {
    return "";
  };

  const LogOutAlert = () => {
    setLogOutAlertHandler(true);
  };

  const MenuList = (ico, elem, logot = 0) => {
    const funcHandler = {
      func4: settingAccount,
      func5: LogOutAlert,
    };
    return (
      <div
        className={`flex p-2 gap-3 cursor-pointer hover:bg-slate-100 ${
          logot === 5 ? "text-orange-600" : ""
        }`}
        onClick={funcHandler["func" + logot]}
      >
        <FontAwesomeIcon icon={["fas", `${ico}`]} className="text-lg w-5" />
        <div className="truncate">{elem}</div>
      </div>
    );
  };
  const LogOutAlertElement = () => {
    return (
      <div className="w-full h-screen bg-stone-950/25 fixed top-0 z-[1000] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Keluar?</h2>
          <p className="text-gray-600 mb-6">Apakah Anda yakin ingin logout?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={LogoutConfirm}
              databtn="false"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Tidak
            </button>
            <button
              onClick={LogoutConfirm}
              databtn="true"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Ya
            </button>
          </div>
        </div>
      </div>
    );
  };
  const LogoutConfirm = (event) => {
    if (event.currentTarget.attributes[0].value === "true") {
      /**/ setDataAkun((prevState) => ({
        ...prevState,
        statusConnect: false,
      }));
      setLogOutTrue(true);

      console.log("LOGOT", event.currentTarget.attributes[0].value);
    }
    setProfileIcoClick(0);
    console.log("STATCON konf", profileIcoClick);
    setLogOutAlertHandler(false);
    //console.log("LOGOT", event.currentTarget.attributes[0].value);
  };

  useEffect(() => {
    if (fetch) {
      DataCheck();

      setInterval(() => {
        const dotIndicator = parseInt(ind / 2) % 4;
        if (dotIndicator === 0) setDotLoad("");
        if (dotIndicator === 1) setDotLoad(".");
        if (dotIndicator === 2) setDotLoad("..");
        if (dotIndicator === 3) setDotLoad("...");
        ind++;
        //temot();
        //return "oke gas";
      }, 500);
    }
  }, [fetch, setFetch]);
  //console.log("DATA AKUN", getDataInfo);
  return (
    <>
      {(() => {
        if (logOutAlertHandler) return LogOutAlertElement();
      })()}
      <div className="h-screen">
        <nav
          className={`flex p-4 justify-between inline sticky z-[1] top-0 ${
            dataAkun.statusConnect === true ? "shadow bg-neutral-200" : ""
          }`}
        >
          <div className="w-56 flex justify-between items-center">
            <a className="text-3xl font-bold text-emerald-700" href="/">
              Zakatkan
            </a>
            {(() => {
              if (dataAkun.statusConnect === true && prop.dir === "beranda")
                return (
                  <FontAwesomeIcon
                    icon={[
                      "fas",
                      sideMenuClick === 0
                        ? "fa-angles-left"
                        : "fa-angles-right",
                    ]}
                    className="p-1 tex-xl cursor-pointer"
                    onClick={sideMenuToggle}
                  />
                );
            })()}
          </div>
          {(() => {
            if (dataAkun.statusConnect === true) {
              return (
                <div className="flex flex-col">
                  <div
                    className="w-8 h-8 p-2 border-2 border-black rounded-full text-white flex items-center justify-center text-md text-center cursor-pointer"
                    onClick={profileIcon}
                    style={{ backgroundColor: `rgb(${avaClr})` }}
                  >
                    <FontAwesomeIcon icon={["fas", "fa-user"]} />
                  </div>
                  {(() => {
                    if (profileIcoClick === 1)
                      return (
                        <div className="w-48 min-h-52 p-2 border absolute top-14 right-4 bg-white shadow-md font-semibold cursor-pointer">
                          {menuElemen.ico.map((el, index) => {
                            return (
                              <div key={index}>
                                {MenuList(
                                  el,
                                  menuElemen.elemHolder[index],
                                  index
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    else return <></>;
                  })()}
                </div>
              );
            }
            if ((typeof Storage === "undefined" ? 0 : localStorage.length) < 1)
              return (
                <div className="flex w-44 text-center justify-between">
                  <a
                    className="px-4 py-2 w-20 border text-emerald-700 border-emerald-500 rounded-lg hover:bg-slate-200"
                    href="/login"
                  >
                    Masuk
                  </a>
                  <a
                    className="px-4 py-2 w-20 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                    href="/signup"
                  >
                    Daftar
                  </a>
                </div>
              );

            //console.log("DATA AKUN INTRO", );
          })()}
        </nav>
        {(() => {
          if (
            (typeof Storage === "undefined" ? 0 : localStorage.length) < 1 &&
            !logOutTrue
          ) {
            if (prop.dir !== "beranda") {
              window.location.href = "/login";
            } else
              return (
                <>
                  <div className="p-4 flex flex-col justify-around items-center h-5/6">
                    <div className="">
                      <h1 className="font-extrabold text-[86px] text-center text-cyan-600">
                        Lakukan Pecatatan Zakat dengan Mudah
                      </h1>
                    </div>
                    <a
                      className="text-xl bg-emerald-500 text-white text-center w-72 p-3 rounded-xl hover:bg-emerald-700"
                      href="/signup"
                    >
                      Bergabung Sekarang
                    </a>
                  </div>
                  <div className="h-screen w-full bg-cover bg-center bg-intro absolute top-0 z-[-1] opacity-10"></div>
                </>
              );
          } else {
            if (dataAkun.statusConnect) {
              if (prop.dir === "staff")
                return (
                  <Form_Login_Signup type={dataAkun.type} logSign={prop.dir} />
                );
              if (prop.dir === "add-pos") {
                return <AddPos type={dataAkun.type} dataStaff={dataStaff} />;
              }
              if (prop.dir === "pos") {
                return <PosZakat data={dataAkun} edit={false} />;
              }
              if (prop.dir === "pos-edit") {
                return <PosZakat data={dataAkun} edit={true} />;
              }
              if (prop.dir === "bayar") {
                return <BayarZakat type={dataAkun.type} data={dataAkun} />;
              } else {
                return (
                  <>
                    <Beranda
                      loading={loading}
                      data={dataAkun}
                      sideMenu={sideMenuClick}
                    />
                  </>
                );
              }
            } else {
              if (logOutTrue) {
                localStorage.removeItem(localKey);
                window.location.href = "./login";
              } else {
                return loading ? (
                  <>
                    <div>
                      <div className="flex flex-col items-center justify-center h-screen">
                        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">
                          Loading, Mohon tunggu{dotLoad}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex flex-col items-center justify-center h-screen">
                      <FontAwesomeIcon
                        icon={["fas", "fa-triangle-exclamation"]}
                        className="text-6xl text-red-500"
                      />
                      <p className="mt-4 text-lg font-semibold text-gray-700">
                        Gagal mengambil data
                      </p>
                      <a href="./" className="font-semibold text-blue-700">
                        Reload
                      </a>
                    </div>
                  </div>
                );
              }
            }
          }
        })()}
        {
          //console.log("DATA AKUN", dataAkun)
        }
      </div>
    </>
  );
}

export default IntroPage;
