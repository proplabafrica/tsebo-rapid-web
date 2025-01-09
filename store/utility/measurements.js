import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["type"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true,
    measurements: []
  }),
  mutations: {
    setMeasurements(state, measurements) {
      state.measurements = dataSort.populateList({
        targetArray: state.measurements,
        newArray: measurements,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setPagination(state, { total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      state.pagination = { total, perPage, page, lastPage };
    },
    toggleRefresh(state, refresh = true) {
      state.refresh = refresh;
    }
  },
  actions: {
    async getMeasurements({ commit, state }, $this) {
      var { $axios } = $this;
      var {
        associations,
        pagination,
        measurements: storedMeasurements,
        refresh
      } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.measurementsLoading = false;
        return ($this.measurements = storedMeasurements);
      }

      try {
        const response = await $axios.get("measurements", {
          params: { associations, page, perPage }
        });
        commit("setMeasurements", response.data.data);
        commit("setPagination", response.data);
        $this.measurements = response.data.data;
        $this.measurementsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
