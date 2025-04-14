import React from "react";

function EnkripData() {
  let psw = {
    value: "OMKEgams",
    timeId: String(new Date().getTime()),
    keyId: String(Math.random()).substring(2, 15),
    key: function () {
      let keys = {
        pswVal: this.value.length,
        idSum: 0,
        total: 0,
      };

      this.keyId.split("").forEach((arr) => {
        keys.idSum += parseInt(arr);
        keys.total = keys.pswVal + keys.idSum;
      });
      return keys;
    },
    pswArr: function () {
      return this.value.split("");
    },
    newKeyId: function (idx = -1) {
      if (idx < 0)
        return this.keyId + String(this.key().total).padStart(4, "0");
      if (idx >= 0)
        return parseInt(
          String(this.keyId + String(this.key().total).padStart(4, "0")).split(
            ""
          )[idx]
        );
    },
    rawEncript: "",
    encripted: function () {
      return btoa(
        unescape(
          encodeURIComponent(
            this.rawEncript +
              `${String(this.key().pswVal).padStart(3, "0")}${String(
                this.key().idSum
              ).padStart(3, "0")}${this.newKeyId()}`
          )
        )
      );
    },
    sesionKey: function () {
      return btoa(
        unescape(
          encodeURIComponent(
            this.rawEncript +
              `${String(this.key().pswVal).padStart(3, "0")}${String(
                this.key().idSum
              ).padStart(3, "0")}${this.timeId}`
          )
        )
      );
    },
  };

  let charc = [];
  psw.pswArr().forEach((chr, index) => {
    if ((index + (psw.key().pswVal & psw.key().total)) % 2 === 0)
      charc.push(chr.charCodeAt(0) + psw.newKeyId(index));
    else charc.push(chr.charCodeAt(0) ^ psw.newKeyId(index));
  });
  charc.forEach((ar) => (psw.rawEncript += String.fromCharCode(ar)));
  //enkrip = window.btoa(psw)

  /**/ console.log([psw.value, psw.keyId], {
    charc,
    key: psw.key(),
    newTimeId: psw.newKeyId(),
    raw: psw.rawEncript,
    rawSes: psw.sesionKey(),
    encr: psw.encripted(),
    rawdekrip: decodeURIComponent(escape(atob(psw.encripted()))),
  });

  const dekrip = (enc) => {
    let dkrp = [];
    //String.fromCharCode(65)
    const decode = decodeURIComponent(escape(atob(enc)));
    const spKey = {
      raw: decode.substring(0, decode.length - 23),
      key: decode.substring(decode.length - 23, decode.length),
    };

    const encKey = {
      originLength: parseInt(spKey.key.substring(0, 3)),
      sumTimeId: parseInt(spKey.key.substring(3, 6)),
      keyTimeId: parseInt(spKey.key.substring(6, 23)),
      keyTotal: parseInt(spKey.key.substring(19, 23)),
    };

    spKey.raw.split("").forEach((chr, idx) => {
      if ((idx + (spKey.raw.length & encKey.keyTotal)) % 2 === 0)
        dkrp.push(chr.charCodeAt(0) - String(encKey.keyTimeId).split("")[idx]);
      else
        dkrp.push(chr.charCodeAt(0) ^ String(encKey.keyTimeId).split("")[idx]);
    });

    let finalDescription = "";

    dkrp.forEach((chr) => (finalDescription += String.fromCharCode(chr)));
    return finalDescription; //parseInt(spKey.key.substring(19, 23));
  };

  console.log("dekrip psw :", dekrip(psw.encripted()));

  return (
    <>
      <h1>Enkrip</h1>
    </>
  );
}
export default EnkripData;
