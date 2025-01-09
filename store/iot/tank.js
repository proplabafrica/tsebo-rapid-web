export default {
  state: () => ({
    value: 80
  }),
  mutations: {
    setTankValue(state, value) {
      state.value = value;
    }
  },
  actions: {
    getTankValue({ commit, state }, $this) {
      var { value } = state;
      commit("setTankValue", value);

      return value;
    }
  }
};
