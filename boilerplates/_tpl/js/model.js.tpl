export default {
  namespace: '%namespace%',
  state: {
    user: null,
  },
  effects: {
    * getUserInfo({payload}, {put, call}) {
      const {data, code = -1} = yield call(fetch, '//example.com/api/user.json');
      if (code === 0) {
        yield put({
          type: 'load',
          payload: {user: data},
        });
      } else {
        alert('Unable to get user info fail!');
      }
    }
  },
  reducers: {
    load(state, payload) {
      return {
        ...state,
        ...payload,
      };
    }
  }
};
