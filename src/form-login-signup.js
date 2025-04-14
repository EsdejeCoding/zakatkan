import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResizeComponent from "./ResizeComponent ";
import DataHandler from "./data-handler";
import {
  createPost,
  getPosts,
  findPost,
  updatePost,
  updateLogin,
} from "./data-server-handler.js";
import EnkripBaru from "./enkrip-baru.js";

let idcP = 0;
let usernameCriteria = false;
function Form_Login_Signup(prop) {
  if (prop.type === "staff") window.location.href = "./";
  const [formFor, setFormFor] = useState({
    property: prop.logSign,
    login: prop.logSign === "log",
    signup: prop.logSign === "sign",
    addStaff: prop.logSign === "staff",
    utilities: function () {
      let uti = {};
      if (this.login) {
        uti = {
          anchor: ["Belum memiliki akun? ", "Daftarkan Akun Anda"],
          href: "/signup",
          head: "Silahkan masukkan akun anda.",
          button: "Masuk",
        };
      }
      if (this.signup) {
        uti = {
          anchor: ["Sudah memiliki akun? ", "Masuk ke Akun Anda"],
          href: "/login",
          head: "Silahkan daftarkan data akun anda.",
          button: "Daftar",
        };
      }
      if (this.addStaff) {
        uti = {
          head: "Silahkan daftarkan akun staff anda.",
          button: "Tambah",
        };
      }
      return uti;
    },
  });
  const [heightInputBox, setHeightInputBox] = useState(() => {
    if (prop.logSign === "log") return "h-32";
    if (prop.logSign === "sign") return "min-h-80";
    if (prop.logSign === "staff") return "min-h-60";
  });
  const [showPass, setShowPass] = useState({
    main: 0,
    konfir: 0,
  }); /**/
  const [inputData, setInputData] = useState({
    idLogin: String(new Date().getTime()) + "",
    email: "",
    username: "",
    password: "",
  });

  const [usernameHandler, setUsernameHandler] = useState(false);

  const [pswHandler, setPswHandler] = useState({
    event: false,
    main: false,
    konfir: false,
    strongIndicator: 0,
    strongStyle: {
      background: "bg-emerald-100",
      text: "text-emerald-500",
    },
    weakStyle: {
      background: "bg-orange-100",
      text: "text-orange-600",
    },
  });

  const { windowWidth, windowHeight } = ResizeComponent();
  const [submitSignUp, setSubmitSignUp] = useState({
    submit: false,
    konfirPswHdl: false,
    usernameHdl: false,
    connect: false,
    konfirmPsw: "",
    searchEmailUser: {},
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginLocal, setLoginLocal] = useState(null);

  const inputType = ["username", "password"];

  const GetBrowserName = () => {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.includes("Firefox")) {
      browserName = "MozillaFirefox";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browserName = "GoogleChrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari";
    } else if (userAgent.includes("Edg")) {
      browserName = "MicrosoftEdge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      browserName = "Opera";
    } else {
      browserName = "Browser tidak dikenali";
    }

    return browserName;
  };

  if (formFor.signup) inputType.splice(0, 0, "email");
  if (formFor.signup || formFor.addStaff) inputType.push("konfirmasi_password");

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

  let indicatorPassword = 0; //showPass;
  const PasswordShow = (event) => {
    const dataKey = event.currentTarget.getAttribute("data-key");
    if (dataKey === "password") indicatorPassword = showPass.main;
    if (dataKey === "konfirmasi_password") indicatorPassword = showPass.konfir;

    const inputPassword =
      event.currentTarget.parentElement.previousElementSibling;

    console.log(showPass);
    inputPassword.type = indicatorPassword < 1 ? "text" : "password";

    indicatorPassword++;

    if (dataKey === "password") {
      setShowPass((prevState) => ({
        ...prevState,
        main: indicatorPassword % 2,
      }));
    }
    if (dataKey === "konfirmasi_password") {
      setShowPass((prevState) => ({
        ...prevState,
        konfir: indicatorPassword % 2,
      }));
    }
  };

  const LogSignAnchor = () => {
    if (!formFor.addStaff)
      return (
        <div>
          <p>
            {formFor.utilities().anchor[0]}
            <a
              className="text-cyan-600 font-bold"
              href={formFor.utilities().href}
            >
              {formFor.utilities().anchor[1]}
            </a>
          </p>
        </div>
      );
  };
  const InputHandler = (event) => {
    setInputData((prv) => ({
      ...prv,
      local: {
        key: String(Math.random()).substring(2, 10),
        browser: GetBrowserName(),
      },
    }));
    event.currentTarget.classList.remove("bg-[#ff000024]");

    const inputId = event.currentTarget.id;
    const inputValue = event.currentTarget.value;
    if (inputId === "email") {
      event.currentTarget.value = inputValue.toLowerCase().trim();
      setInputData((prevState) => ({
        ...prevState,
        email: inputValue.toLowerCase(),
      }));
    }
    if (inputId === "username") {
      event.currentTarget.value = inputValue.toLowerCase().trim();
      setInputData((prevState) => ({
        ...prevState,
        username: inputValue.toLowerCase(),
      }));
      setUsernameHandler(inputValue.length > 0);
    }
    if (inputId === "password") {
      //pswHandler.strongIndicator++
      const pswIndic = (prc, clr, sts) => {
        setPswHandler((prevState) => ({
          ...prevState,
          ...{
            color: clr,
            status: sts,
            strongIndicator: prc,
          },
        }));
      };
      setInputData((prevState) => ({
        ...prevState,
        password: inputValue,
      }));
      const calculateStrength = () => {
        idcP = 0;
        /**/ if (inputValue.length >= 8) idcP++;
        if (/[A-Z]/.test(inputValue)) idcP++;
        if (/[a-z]/.test(inputValue)) idcP++;
        if (/\d/.test(inputValue)) idcP++;
        if (/[@$!%*?&#_-]/.test(inputValue)) idcP++;

        if (idcP === 0) pswIndic(10, "#bb0000", "Sangat Lemah");
        if (idcP === 1) pswIndic(20, "#bb0000", "Sangat Lemah");
        if (idcP === 2) pswIndic(40, "#ff0000", "Lemah");
        if (idcP === 3) pswIndic(60, "#FF9800", "Sedang");
        if (idcP === 4) pswIndic(80, "#4db738", "Kuat");
        if (idcP === 5) pswIndic(100, "#10b981", "Sangat Kuat");
      };
      calculateStrength();
      setPswHandler((prevState) => ({
        ...prevState,
        ...{
          event: true,
          main: inputValue.length > 7,
        },
      }));
      setPswHandler((prevState) => ({
        ...prevState,
        event: inputValue.length > 0,
      }));
    }
    if (inputId === "konfirmasi_password")
      setSubmitSignUp((prevState) => ({
        ...prevState,
        ...{ konfirPswHdl: false, konfirmPsw: inputValue },
      }));

    setSubmitSignUp((prevState) => ({
      ...prevState,
      ...{ submit: false },
    }));
    if (formFor.signup) setHeightInputBox("h-80");
  };

  const GetDataAkun = async () => {
    try {
      const getOldData = await getPosts(0);
      //console.log("APDET", getOldData[0].akun);
      return getOldData;
    } catch (error) {}
  };

  const SubmitData = async (event) => {
    event.preventDefault();

    const divContainer = event.target.children[0].closest("div");

    setSubmitSignUp((prevState) => ({
      ...prevState,
      ...{ submit: true },
    }));
    if (formFor.login) {
      try {
        setLoading(true); // Menampilkan loading saat request sedang diproses
        if (inputData.username.length > 0 && inputData.password.length > 0) {
          let enkrip = EnkripBaru(inputData, true, true);
          const loginPost = await findPost(inputData.username, enkrip.password); // Memanggil createPost untuk mengirim data ke server
          setSubmitSignUp((prevState) => ({
            ...prevState,
            ...{ connect: loginPost.statusConnect },
          }));
          if (!loginPost.statusConnect) {
            [".username-input-wrap", ".password-input-wrap"].forEach((elm) => {
              divContainer
                .querySelector(elm)
                .classList.remove("border-emerald-500");
              divContainer.querySelector(elm).classList.add("border-red-500");
            });
          } else setLoginLocal(enkrip.logins);
          console.log("DATA AKUN:", loginPost); // Menampilkan post yang berhasil dibuat
          //const apdet = await updateLogin(loginPost, enkrip.logins);
          //console.log("ENKRIPSI", { ...newInput, ...EnkripBaru(inputData, true) });
        }
      } catch (err) {
        setError("Failed to GET post. Please try again."); // Menangani error jika gagal
        console.error("Error GET post:", err);
      } finally {
        setLoading(false); // Menyembunyikan loading setelah proses selesai
      }
    }
    if (formFor.signup || formFor.addStaff) {
      const inputElm = divContainer.querySelectorAll("input.w-full");

      let signPost = {};
      try {
        setLoading(true);
        if (formFor.signup) signPost = { email: 0, user: 0 }; /*await findPost(
            inputData.username,
            inputData.password,
            inputData.email //formFor.addStaff ? "THIS EMAIL" : inputData.email
          );*/

        if (formFor.addStaff) {
          const localKey = localStorage.key(0);
          const getLocalData = JSON.parse(localStorage.getItem(localKey));
          const dekripLocal = EnkripBaru({
            idLogin: getLocalData.id,
            enkripsi: getLocalData.token,
          });
          console.log("sercing", dekripLocal[1]);
          signPost = await findPost(
            [dekripLocal[1], inputData.username],
            inputData.password,
            "THIS EMAIL"
          );
        }

        if (
          signPost.email < 1 &&
          signPost.user < 1 &&
          usernameCriteria &&
          pswHandler.strongIndicator === 100 &&
          inputData.password === submitSignUp.konfirmPsw
        ) {
          let enkrip = null;
          if (formFor.signup) {
            let { local, password, ...newInput } = inputData;
            enkrip = EnkripBaru(inputData, true);
            let oldData = await getPosts(0);

            /**/ oldData[0].akun.push({
              ...newInput,
              type: "admin",
              password: enkrip.password,
            });
            const createdPost = await updatePost("data", 0, {
              id: 0,
              akun: oldData[0].akun,
            });
          }
          if (formFor.addStaff) {
            let { local, password, email, ...newInput } = inputData;
            enkrip = EnkripBaru(inputData, true);
            const createdPost = await createPost({
              ...newInput,
              email: signPost.thisEmail,
              type: "staff",
              password: enkrip.password,
            });
            setSubmitSignUp((prev) => ({ ...prev, addStaffPost: true }));
          }

          console.log("Post created:", [
            enkrip,
            signPost.email < 1,
            usernameCriteria,
            pswHandler.strongIndicator === 100,
            inputData.password === submitSignUp.konfirmPsw,
          ]);
          /**/ setLoginLocal(enkrip.logins[0]);
        }
        //if(submitSignUp.searchEmailUser.email < 1 && usernameCriteria && pswHandler.strongIndicator === 100 && inputData.password === submitSignUp.konfirmPsw)
      } catch (err) {
        setError("Failed to create post. Please try again."); // Menangani error jika gagal
        console.error("Error creating post:", err);
      } finally {
        setLoading(false); // Menyembunyikan loading setelah proses selesai
      }
      setSubmitSignUp((prevState) => ({
        ...prevState,
        ...{ konfirPswHdl: true, searchEmailUser: signPost },
      }));

      setHeightInputBox(formFor.addStaff ? "h-[270px]" : "h-[350px]");
      let indexSel = formFor.addStaff ? 1 : 0;
      if (
        !formFor.addStaff &&
        (inputData.email.length < 1 || submitSignUp.searchEmailUser.email > 0)
      ) {
        inputElm[0 - indexSel].classList.add("bg-[#ff000024]");
        //divContainer.children[0].classList.remove("border-emerald-500");
      }
      if (
        inputData.username.length < 1 ||
        submitSignUp.searchEmailUser.user > 0 ||
        !usernameCriteria
      ) {
        inputElm[1 - indexSel].classList.add("bg-[#ff000024]");
      }
      if (pswHandler.strongIndicator < 100)
        inputElm[2 - indexSel].classList.add("bg-[#ff000024]");
      if (
        submitSignUp.konfirmPsw.length < 1 ||
        inputData.password !== submitSignUp.konfirmPsw
      )
        inputElm[3 - indexSel].classList.add(...["bg-[#ff000024]"]);
      /*if (inputData.password === submitSignUp.konfirmPsw)
        console.log("konfirP", "SAMA");
      if (pswHandler.status === "Sangat Kuat")
        console.log("konfirP", "Sangat Kuat");
      */
    }

    //CobaEa(inputData); //DataHandler(inputData);
    //console.log("add data", inputData);
  };

  const AddStaffConfirm = (event) => {
    if (event.currentTarget.attributes[0].value === "more")
      window.location.href = "./add-staff";
    if (event.currentTarget.attributes[0].value === "done")
      window.location.href = "./";
  };

  if (
    (typeof Storage === "undefined" ? 0 : localStorage.length) < 1 ||
    (formFor.addStaff && prop.type === "admin")
  ) {
    if (typeof Storage !== "undefined" && loginLocal && !formFor.addStaff)
      localStorage.setItem(
        loginLocal.localKey,
        JSON.stringify({
          id: loginLocal.id,
          token: loginLocal.token,
        })
      );
    console.log("prop", prop.type === "admin");
    return (
      <>
        <div className="h-screen">
          {(() => {
            if (!formFor.addStaff)
              return (
                <header
                  className={
                    windowWidth >= 460
                      ? `flex justify-between items-center p-4`
                      : "p-4"
                  }
                >
                  <div className="text-3xl text-emerald-700 font-bold">
                    <a href="/">Zakatkan</a>
                  </div>

                  {windowWidth >= 460 ? LogSignAnchor() : ""}
                </header>
              );
          })()}
          <main
            className={`h-5/6 flex ${
              windowWidth < 460 ? "flex-col" : ""
            } justify-center items-center p-4`}
          >
            <div className={`${windowWidth < 460 ? `w-[300px]` : "w-96"} m-4`}>
              <div className="mb-10">
                <h1 className="mb-2 text-2xl font-bold">
                  {formFor.utilities().button} ke Zakatkan
                </h1>
                <p>{formFor.utilities().head}</p>
              </div>
              <form onSubmit={SubmitData}>
                <div
                  className={`${heightInputBox} flex flex-col justify-between`}
                >
                  {inputType.map((typ) => {
                    const tp = typ.replace("konfirmasi_", "");
                    return (
                      <div key={typ}>
                        <div
                          className={`${tp}-input-wrap relative rounded-lg`}
                          onClick={ClassStyle}
                          onBlur={ClassStyle}
                        >
                          <label className="text-gray-400 leading-5 h-8 m-2 p-2 absolute capitalize">
                            {typ.replace("_", " ")}
                          </label>
                          <div
                            className={`${
                              tp === "password" ? "flex items-center " : ""
                            }border border-gray-400 w-full hover:border-gray-950 rounded-lg`}
                          >
                            <input
                              className={`w-full py-3 px-2 outline-none rounded-lg`}
                              id={typ}
                              onChange={InputHandler}
                              type={tp === "username" ? "text" : tp}
                              style={{
                                backgroundColor: (() => {
                                  if (
                                    (formFor.signup || formFor.addStaff) &&
                                    typ === "password" &&
                                    pswHandler.event
                                  )
                                    return pswHandler.color + "24";
                                })(),
                              }}
                            />
                            {(() => {
                              if (tp === "password")
                                return (
                                  <label className="p-2 leading-4 hover:bg-slate-200 hover:rounded-full bg-white">
                                    <input
                                      data-key={typ}
                                      className="hidden"
                                      type="checkbox"
                                      onChange={PasswordShow}
                                    />
                                    {(() => {
                                      if (typ === "password") {
                                        let eyeMP =
                                          showPass.main > 0
                                            ? "eye-slash"
                                            : "eye";
                                        return (
                                          <FontAwesomeIcon
                                            icon={["fas", eyeMP]}
                                            className="text-gray-500 text-xl"
                                          />
                                        );
                                      }
                                      if (typ === "konfirmasi_password") {
                                        let eyeKP =
                                          showPass.konfir > 0
                                            ? "eye-slash"
                                            : "eye";
                                        return (
                                          <FontAwesomeIcon
                                            icon={["fas", eyeKP]}
                                            className="text-gray-500 text-xl"
                                          />
                                        );
                                      }
                                    })()}
                                  </label>
                                );
                            })()}
                          </div>
                        </div>
                        {(() => {
                          if (
                            (formFor.signup || formFor.addStaff) &&
                            typ === "password" &&
                            pswHandler.event
                          ) {
                            return (
                              <div className="flex justify-between items-center mt-2">
                                <div className="w-64 h-2 bg-stone-300 rounded-lg">
                                  <div
                                    className={`h-2 rounded-lg`}
                                    style={{
                                      backgroundColor: pswHandler.color,
                                      width: pswHandler.strongIndicator + "%",
                                    }}
                                  ></div>
                                </div>
                                <div
                                  className="text-right font-md"
                                  style={{ color: pswHandler.color }}
                                >
                                  {pswHandler.status}
                                </div>
                              </div>
                            );
                          }
                          if (
                            (formFor.signup || formFor.addStaff) &&
                            typ === "username" &&
                            usernameHandler &&
                            !((input) => {
                              let idcUN = [0, 0, 0];
                              if (/^[a-z0-9_.]+$/.test(input)) {
                                if (/[a-z]/.test(input)) idcUN[0] = 3;
                                if (/\d/.test(input)) idcUN[1] = 1;
                                if (/[._]/.test(input)) idcUN[2] = 1;
                              }
                              usernameCriteria =
                                idcUN[0] + idcUN[1] + idcUN[2] >= 3;
                              return idcUN[0] + idcUN[1] + idcUN[2] >= 3;
                            })(inputData.username)
                          ) {
                            usernameCriteria = false;
                            return (
                              <div className="text-right text-red-500 w-full block">
                                *Username tidak sesuai
                              </div>
                            );
                          }
                          if (submitSignUp.submit) {
                            if (typ === "email")
                              return (
                                <div className="text-right text-red-500 w-full block">
                                  {(() => {
                                    if (inputData.email.length < 1)
                                      return "*Email harus diisi";
                                    if (submitSignUp.searchEmailUser.email > 0)
                                      return "*Email sudah ada";
                                  })()}
                                </div>
                              );
                            if (typ === "username")
                              return (
                                <div className="text-right text-red-500 w-full block">
                                  {(() => {
                                    if (inputData.username.length < 1)
                                      return "*Username harus diisi";
                                    if (submitSignUp.searchEmailUser.user > 0)
                                      return "*Username sudah ada";
                                  })()}
                                </div>
                              );
                            if (
                              (formFor.signup || formFor.addStaff) &&
                              typ === "password" &&
                              pswHandler.strongIndicator < 100
                            )
                              return (
                                <div className="text-right text-red-500 w-full block">
                                  *Password harus diisi
                                </div>
                              );
                            if (typ === "konfirmasi_password")
                              return (
                                <div className="text-right text-red-500 w-full block">
                                  {(() => {
                                    if (submitSignUp.konfirmPsw.length < 1)
                                      return "*Konfirmasi password harus diisi";
                                    if (
                                      inputData.password !==
                                        submitSignUp.konfirmPsw &&
                                      submitSignUp.konfirPswHdl
                                    ) {
                                      return "*Password berbeda";
                                    }
                                  })()}
                                </div>
                              );
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>
                {(() => {
                  if (prop.logSign === "log")
                    return (
                      <div className="flex items-center justify-between h-10 mt-4">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <span>Ingat saya</span>
                        </label>
                        <a className="text-cyan-600 font-bold" href="#">
                          Lupa password?
                        </a>
                      </div>
                    );
                })()}

                <button className="w-full h-12 px-5 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-lg mt-6">
                  {formFor.utilities().button}
                </button>
                {(() => {
                  if (
                    formFor.login &&
                    submitSignUp.submit &&
                    !submitSignUp.connect
                  )
                    return (
                      <div className="text-right text-red-500 w-full block">
                        *Gagal melakukan login. Coba lagi!
                      </div>
                    );
                })()}
              </form>
            </div>
            {(() => {
              if (windowWidth < 460)
                return <div className="my-4">{LogSignAnchor()}</div>;
            })()}
          </main>
          {formFor.addStaff && submitSignUp.addStaffPost ? (
            <>
              <div className="w-full h-screen bg-stone-950/25 fixed top-0 z-[0] flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <p className="text-gray-600 mb-6">
                    Berhasil menambahkan <b>{inputData.username}</b>
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={AddStaffConfirm}
                      databtn="more"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-md"
                    >
                      Tambah Lagi
                    </button>
                    <button
                      onClick={AddStaffConfirm}
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
  } else {
    if (!formFor.addStaff) window.location.href = "./";
  }
}

export default Form_Login_Signup;
