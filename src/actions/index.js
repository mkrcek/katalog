import axios from 'axios';

export const FETCH_STONES = 'fetch_stones';
export const FETCH_STONE  = 'fetch_stone';
export const PUT_STONE  = 'put_stone';

export const CHANGE_SETTING = 'change_setting';

export const CREATE_POST = 'create_post';
export const DELETE_POST = 'delete_post';

import { ROOT_URL } from '../tools/dm_tools'; //globální konstanta
import { API_KEY } from '../tools/dm_tools'; //globální konstanta







//admin part
export const FETCH_KATALOG = 'fetch_katalog';

// Katalog
export function fetchKatalog() {
  const request = axios.get(`${ROOT_URL}/katalog/modules_/${API_KEY}`);
  return {
    type: FETCH_KATALOG,
    payload: request
  };
}




// ** stones part:

// všechny
export function fetchStones() {
  const request = axios.get(`${ROOT_URL}/doomaster/sensors/${API_KEY}`);

  // let tim = new Date();
  // console.log("deláme fetchStones", tim);

  return {
    type: FETCH_STONES,
    payload: request
  };
}

// jeden
export function fetchStone(unid) {

  // let tim = new Date();
  // console.log("deláme fetchStone", tim);

  const request = axios.get(`${ROOT_URL}/doomaster/sensors/${unid}${API_KEY}`);
  // console.log(`${ROOT_URL}/doomaster/sensors/${unid}${API_KEY}`);
  return {
    type: FETCH_STONE,
    payload: request
  }
}

// odeslání values po kliknutí
export function putStone(unid, values, callback) {
  // let values = {"value": "1"};
  console.log("Odesilam:");
  console.log("JSON:   ", values);
  console.log("ADRESA: ",`${ROOT_URL}/doomaster/sensors/${unid}${API_KEY}`);
  // const config = { headers: {'Content-Type': 'application/json'} }; ... a pak přidat  v requestu jako posledni, za values,

  const request = axios.put(`${ROOT_URL}/doomaster/sensors/${unid}${API_KEY}`, values)
    .then (() => callback());
  return {
    type: PUT_STONE,
    payload: request
  }
}

export function createPost(values, callback) {

  const request = axios.post(`${ROOT_URL}/doomaster/sensors/${API_KEY}`, values)
    .then (() => callback());

  return {
    type: CREATE_POST,
    payload: request
  }
}


export function deletePost(id, callback) {
  const request = axios.delete(`${ROOT_URL}/doomaster/sensors/${id}${API_KEY}`)
    .then(() => callback());

  return {
    type: DELETE_POST,
    payload: id
  }
}



export function changeSetting(newSetting) {
  return {
    type: CHANGE_SETTING,
    payload: newSetting
  }
}
