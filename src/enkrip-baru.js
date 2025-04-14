import React from "react";

function EnkripBaru(data, encriptData = false, login = false) {
  let akun = data;

  console.log(akun);
  let mixLocal = "";
  let idSum = 0;

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

  const simpleNextDecript = (v, k) => {
    v = decodeURIComponent(escape(atob(v)));
    let decr = "";
    v.split("").forEach((chr) => {
      decr += String.fromCharCode(chr.charCodeAt(0) - k);
    });
    return decr;
  };

  const mixedChar = (t, n) => {
    let aca = "";
    for (let i = 0; i < n; i++) {
      t.split("").forEach((cr, idx) => {
        if (idx % n === i) aca += cr;
      });
    }
    return aca;
  };

  const backMixedChar = (t, n) => {
    const mixChr = t;
    let ori = new Array(t.length);
    let index = 0;

    for (let i = 0; i < n; i++) {
      t.split("").forEach((char, idx) => {
        if (idx % n === i) {
          ori[idx] = mixChr[index++];
        }
      });
    }
    return ori.join("");
  };

  const finalDekrip = (t) => {
    try {
      let res = [];
      const reg = t.split("#");
      reg.forEach((enc) => {
        res.push(atob(enc));
      });
      return res;
    } catch (e) {}
  };

  const tailKeyDekrip = (t, k) => {
    t = atob(t.split("#").pop());
    let tailDkr = "";
    String(t)
      .split("")
      .forEach((chr, idx) => {
        tailDkr = chr.charCodeAt(0) - String(k).split("")[idx].charCodeAt(0);
      });
    return tailDkr;
  };

  akun.idLogin.split("").forEach((cr) => {
    idSum += parseInt(cr);
  });

  const charValue = (t) => {
    const cha = [];
    t = String(t).toLowerCase();
    t.split("").forEach((c) => {
      const chCode = c.charCodeAt(0);
      if (chCode >= 48 && chCode <= 57) cha.push(chCode - 48);
      if (chCode >= 97 && chCode <= 122) cha.push(chCode - 87);
      if (chCode === 46) cha.push(36);
      if (chCode === 95) cha.push(37);
    });
    return cha;
  };
  const charSum = (ar) => {
    ar = ar.join("").split("");
    let val = 0;
    ar.forEach((c) => {
      val += parseInt(c);
    });

    return val;
  };
  const charSeparate = (v) => parseInt(v / 56) + 35;

  if (encriptData) {
    const psEncNext = (() => {
      const arrChar = charValue(akun.password);
      const sumChar = charSum(arrChar);
      const separate = charSeparate(sumChar);
      const keyPassEnc = parseInt(separate / akun.password.length) + 1;
      const nextPassEnc =
        nextEncript(akun.username, sumChar) +
        String.fromCharCode(separate) +
        nextEncript(akun.password, sumChar);
      return mixedChar(
        btoa(unescape(encodeURIComponent(nextPassEnc))),
        keyPassEnc
      );
    })();

    let keyMix = parseInt(idSum / akun.password.length);
    const emailSimpleEnc = simpleEncript(akun.email);
    const userSimpleEnc = simpleEncript(akun.username);
    const passSimpleEnc = simpleEncript(psEncNext);
    const keySimpleEnc = simpleEncript(
      (function () {
        const keySum = [];
        String(idSum)
          .split("")
          .forEach((chr) => {
            keySum.push(String.fromCharCode(chr.charCodeAt(0) + keyMix));
          });

        return keySum.join("");
      })()
    );
    const localKey = simpleEncript(akun.local.browser + akun.local.key);

    const localValToken = `${emailSimpleEnc}#${userSimpleEnc}#${passSimpleEnc}`; //'halo++apa+kabar++';
    mixLocal = mixedChar(localValToken, keyMix);
    const localValEnc = nextEncript(mixLocal + `#${keySimpleEnc}`, idSum);

    //console.log(tailKeyDekrip(finalDekrip(enk, idSum).pop(), idSum));
    /*console.log({
      key: [idSum, akun.password.length, keyMix],
      amix: mixRes,
      enkrip: enk,
      enk: mixRes + `#${keySimpleEnc}`,
      xdekrip: simpleNextDecript(enk, idSum),
      ztail: tailKeyDekrip(simpleNextDecript(enk, idSum), idSum),
    });
    //
    console.log({
      localSes: {
        localKey,
        id: akun.idLogin,
        token: localValEnc,
      },
      pasEnc: psEncNext,
      akun,
    });*/
    if (!login)
      return {
        logins: [
          {
            localKey,
            id: akun.idLogin,
            token: localValEnc,
          },
        ],
        password: psEncNext,
      };
    else
      return {
        password: psEncNext,
        logins: {
          localKey,
          id: akun.idLogin,
          token: localValEnc,
        },
      };
  } else {
    const dek = simpleNextDecript(akun.enkripsi, idSum);
    const ensp = dek.split("#");
    ensp.pop();
    const tlK = tailKeyDekrip(dek, idSum);
    const bac = backMixedChar(ensp.join("#"), tlK);
    const fin = finalDekrip(bac, tlK);
    let dekripData = {
      simpledekrip: dek,
      mix: ensp.join("#"),
      keyMix: tlK,
      back: bac,
      baaaccc: backMixedChar(
        "cHRAa23MRq3J3ZW9V=qMl1a2wts#cThbW1u#Zc2UaGphYYX2R=",
        5
      ),
      final: fin,
    };
    //console.log("DEKRIP", dekripData);
    return fin;
  }
  /*

inp = document.querySelectorAll('input')
function enkrip(){
	const akun = ['okegas', 'Y0onWWIGRxRAjbyojdzZETj=JFRjJGbNk0N=']
  const mixedChar = (t, n) => {
    let aca = "";
    for (let i = 0; i < n; i++) {
      t.split("").forEach((cr, idx) => {
        if (idx % n === i) aca += cr;
      });
    }
    return aca;
  };
  
  const charValue = (t)=>{
      const cha = []
      t = String(t).toLowerCase()
      t.split('').forEach((c)=>{
          const chCode = c.charCodeAt(0)
          if(chCode >= 48 && chCode <= 57) cha.push(chCode - 48)
          if(chCode >= 97 && chCode <= 122) cha.push(chCode - 87)
          if(chCode === 46) cha.push(36)
          if(chCode === 95) cha.push(37)
      })
      return cha
  }
  const charSum = (ar) =>{
      ar = ar.join('').split('')
      let val = 0
      ar.forEach((c)=>{
          val += parseInt(c)
      })

      return val
  }
  const charSeparate = (v)=> parseInt(v/56)+35
  
  const arrChar = charValue(inp[0].value)
  const sumChar = charSum(arrChar)
  const separate = charSeparate(sumChar)
  const keyEnc = (parseInt(separate/inp[1].value.length)+1)
  const simpleEnc = btoa(btoa(inp[0].value) + String.fromCharCode(separate) + btoa(inp[1].value))
  
	document.querySelector('b').innerHTML = mixedChar(simpleEnc, keyEnc)
	document.querySelector('h2').innerHTML = akun[0] === inp[0].value && akun[1] === mixedChar(simpleEnc, keyEnc)
} 
*/
  /*
  {
    "key": [
        45,
        8,
        5
    ],
    "amix": "cHRAa23MRq3J3ZW9V=qMl1a2wts#cThbW1u#Zc2UaGphYYX2R=",
    "enkrip": "wpB1f27Cjl9gen/CnmB3YMKHwoRmwoNqwp56wplewo5fwqTCocKgUMKQwoHClcKPwoRewqJQwofCkF/CgsKOdMKdwpXChsKGwoVff2pQfMKBwpxq",
    "enk": "cHRAa23MRq3J3ZW9V=qMl1a2wts#cThbW1u#Zc2UaGphYYX2R=#OTo=",
    "xdekrip": "cHRAa23MRq3J3ZW9V=qMl1a2wts#cThbW1u#Zc2UaGphYYX2R=#OTo=",
    "ztail": 5
}
  
  if (encriptData)
    console.log({
      a_key: [idSum, akun.password.length, keyAck],
      b_aseli: str,
      c_enkrip: enk,
      d_acak: mixRes,
      e_balik: backMixedChar(mixRes, keyAck),
      f_dekrip: finalDekrip(enk, idSum),
    });
*/
  // Output: ['halo+', 'apa++', 'kabar++']
}

export default EnkripBaru;
