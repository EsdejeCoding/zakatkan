import React from "react";

function EnkripBaru() {
  let akun = {
    idLogin: "1737033582338",
    email: "owogemoy@gmail.com",
    username: "fufufafa",
    password: "gemoy_025878",
  };

  const simpleEncript = (v) => {
    return btoa(v);
  };

  const nextEncript = (v, k) => {
    let enc = "";
    v.split("").forEach((chr) => {
      enc += String.fromCharCode(chr.charCodeAt(0) + k);
    });
    return btoa(unescape(encodeURIComponent(enc)));
  };

  let idSum = 0;

  akun.idLogin.split("").forEach((cr) => {
    idSum += parseInt(cr);
  });

  let keyAck = parseInt(idSum / akun.password.length);

  const emailSimpleEnc = simpleEncript(akun.email);
  const userSimpleEnc = simpleEncript(akun.username);
  const passSimpleEnc = simpleEncript(akun.password);
  const keySimpleEnc = simpleEncript(
    (function () {
      const keySum = [];
      String(idSum)
        .split("")
        .forEach((chr) => {
          keySum.push(String.fromCharCode(chr.charCodeAt(0) + keyAck));
          console.log("carkod", chr.charCodeAt(0) + keyAck);
        });

      return String.fromCharCode(keySum.join(""));
    })()
  );
  //console.log(emailSimpleEnc+userSimpleEnc+passSimpleEnc)

  console.log([emailSimpleEnc, userSimpleEnc, passSimpleEnc, keySimpleEnc]);

  const str = `${emailSimpleEnc}#${userSimpleEnc}#${passSimpleEnc}#${keySimpleEnc}`; //'halo++apa+kabar++';
  const enk = nextEncript(str, idSum);

  let st = str.split("");
  let ack = "";

  /*st.forEach((cr, index) => {
    if (index % 4 === 0 && index > 0) ack += "+";
    ack += cr;
  });

  */
  const acak = (t, n) => {
    let aca = "";
    for (let i = 0; i < n; i++) {
      t.split("").forEach((cr, idx) => {
        if (idx % n === i) aca += cr;
      });
    }
    return aca;
  };

  const kembali = (t, n) => {
    let ori = new Array(t.length);
    let index = 0;
    const mxd = t;

    for (let i = 0; i < n; i++) {
      t.split("").forEach((char, idx) => {
        if (idx % n === i) {
          ori[idx] = mxd[index++];
        }
      });
    }
    return ori.join("");
  };

  const finalDekrip = (t, k) => {
    try {
      t = decodeURIComponent(escape(atob(t)));
      let res = [];
      let dek = "";
      t.split("").forEach((chr) => {
        dek += String.fromCharCode(chr.charCodeAt(0) - k);
      });
      const reg = dek.split("#");
      reg.forEach((enc) => {
        res.push(atob(enc));
      });
      return res;
    } catch (e) {}
  };

  const tailKeyDekrip = (t, k) => {
    t = t.charCodeAt(0);
    let tailDkr = ""; //[];
    String(t)
      .split("")
      .forEach((chr, idx) => {
        tailDkr = chr.charCodeAt(0) - String(k).split("")[idx].charCodeAt(0); //tailDkr.push(String.fromCharCode());
      });
    return tailDkr; //String.fromCharCode(tailDkr.join(""));
  };

  console.log(tailKeyDekrip(finalDekrip(enk, idSum).pop(), idSum));

  /*st.forEach((cr, index) => {
    if (index % 3 === 0) ack += cr;
  });
  st.forEach((cr, index) => {
    if (index % 3 === 1) ack += cr;
  });
  st.forEach((cr, index) => {
    if (index % 3 === 2) ack += cr;
  });

  let ori = new Array(ack.length); // Membuat array kosong dengan panjang yang sama
  let index = 0;

  // Pertama-tama petakan indeks dengan modulus 3
  [0, 1, 2].forEach((mod) => {
    ack.split("").forEach((char, i) => {
      if (i % 3 === mod) {
        ori[i] = ack[index++];
      }
    });
  });*/
  ack = acak(enk, keyAck);
  console.log({
    a_key: [idSum, akun.password.length, keyAck],
    b_aseli: str,
    c_enkrip: enk,
    d_acak: ack,
    e_balik: kembali(ack, keyAck),
    f_dekrip: finalDekrip(enk, idSum),
  });

  // Output: ['halo+', 'apa++', 'kabar++']
  return (
    <>
      <h1>baru</h1>
    </>
  );
}

export default EnkripBaru;
