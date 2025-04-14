// src/api.js

import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const api = axios.create({
  baseURL: "http://103.171.85.45:8040/", // URL dari json-server
  //baseURL: "http://localhost:3003/", // URL dari json-server
});

// Fungsi untuk mendapatkan data
export const getPosts = async (id) => {
  try {
    const response = await api.get("/data?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};
export const findWajibZakat = async (query) => {
  try {
    let response = await api.get(`/wajibZakat?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};

export const findPostDataPos = async (pengurus, type = "admin") => {
  try {
    console.log(`/data?id=${pengurus}`);
    let response = [];
    if (type === "admin") response = await api.get(`/pos?admin=${pengurus}`);
    if (type === "staff") response = await api.get(`/pos?staff=${pengurus}`);
    if (type === "BYID") {
      response = await api.get(`/pos?id=${pengurus}`);
    }
    if (type === "BYQUERIES") response = await api.get(`/pos?${pengurus}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
    //return false;
  }
};

export const findPost = async (
  username,
  password,
  signEmail = "",
  staffList = false
) => {
  try {
    let response = {};
    let searchEmailUser = {};

    if (
      signEmail !== "THIS EMAIL" &&
      signEmail.length > 0 &&
      staffList === true
    ) {
      response = await api.get(`/akun?email=${signEmail}`);
      return response.data;
    }
    if (staffList === false) {
      if (signEmail.length < 1) {
        response = await api.get(
          `/akun?username=${username}&password=${password}`
        );
        return { ...response.data[0], statusConnect: response.data.length > 0 };
      }
      if (signEmail === "THIS EMAIL") {
        searchEmailUser = {
          user: (await api.get(`/akun?username=${username[1]}`)).data.length,
          email: 0,
          thisEmail: (await api.get(`/akun?username=${username[0]}`)).data[0]
            .email,
        };
        return searchEmailUser;
      }
      if (signEmail !== "THIS EMAIL" && signEmail.length > 0) {
        console.log(`/akun?email=${signEmail}` + `/akun?username=${username}`);
        searchEmailUser = {
          user: (await api.get(`/akun?username=${username}`)).data.length,
          email: (await api.get(`/akun?email=${signEmail}`)).data.length,
        };
        return searchEmailUser;
      }
    }
    //return response;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};

// Fungsi untuk membuat data baru
export const createPost = async (post, link = "akun") => {
  try {
    const response = await api.post("/" + link, post);
    return response.data;
  } catch (error) {
    console.error("Error creating post", error);
    throw error;
  }
};

// src/api.js

export const updatePost = async (dataKey, id, updatedPost) => {
  try {
    const response = await api.put(`/${dataKey}?id=${id}`, updatedPost);
    return response.data;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};

export const updateLogin = async (data, upd) => {
  try {
    data = data;
    data.logins.push(upd);
    const response = await api.patch(`/akun/${data.id}`, {
      logins: data.logins,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};

export const deletePost = async (query) => {
  try {
    await api.delete(`/${query}`);
    return true;
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};

export const findAccountsBySkill = async (skill) => {
  let results = await api.get(`/coba?skill=${skill}`);

  /*let index = 0; // Mulai pencarian dari skill[0]
  let isDone = false; // Penanda jika pencarian sudah selesai

  while (!isDone && index < 100) {
    try {
      // Coba ambil akun berdasarkan skill[index]
      const response = await api.get(`/coba?skill[${index}]=${skill}`);
      console.log("sekil", `/coba?skill[${index}]=${skill}`);
      if (response.data.length > 0) {
        results.push(...response.data); // Tambahkan semua hasil yang ditemukan
      } else {
        isDone = true; // Jika tidak ada data ditemukan, hentikan pencarian
      }
    } catch (error) {
      console.error(`Error fetching data at skill[${index}]:`, error);
      isDone = true;
    }

    index++; // Cek index berikutnya
  }*/

  return results;
};
