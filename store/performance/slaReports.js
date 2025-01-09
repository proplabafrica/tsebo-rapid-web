export default {
  state: () => ({
    statusTabData: null,
    monthOnMonthData: null
  }),
  mutations: {
    setStatusTabData(state, statusTabData) {
      state.statusTabData = statusTabData;
    },
    setMonthOnMonthData(state, monthOnMonthData) {
      state.monthOnMonthData = monthOnMonthData;
    }
  }
};
