import _ from 'lodash';

import { FETCH_KATALOG } from '../actions';

//no, nevím co s PUT_STONE: asi nic- nic se na obrazovce nemění

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_KATALOG:

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
