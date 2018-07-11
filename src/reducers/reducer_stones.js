import _ from 'lodash';

import { FETCH_STONES, FETCH_STONE, DELETE_POST, PUT_STONE } from '../actions';

//no, nevím co s PUT_STONE: asi nic- nic se na obrazovce nemění

export default function(state = {}, action) {
  switch (action.type) {
    case DELETE_POST:
      return _.omit(state, action.payload); //vynechat ze seznamu a zapomenout
    case FETCH_STONE:
      let newState = {...state};
      action.payload.data.forEach((row) => {
        newState[row.unid] = row;
      })
      // console.log("FETCHED STONE", newState);
      return newState;
      // return { ...state, [action.payload.data.unid]: action.payload.data}
    case FETCH_STONES:
      return _.mapKeys(action.payload.data, 'unid');         //podle UNID
    default:
      return state;
  }
}




//FETCH_POST

      // const post = action.payload.data;
      // const newState = { ...state };
      // newState[post.id] = post;
      // return newState;
