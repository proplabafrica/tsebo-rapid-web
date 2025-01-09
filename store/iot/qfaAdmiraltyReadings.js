import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 10000,
      page: 1,
      lastPage: null
    },
    qfaAdmiraltyReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaAdmiraltyReading(state, qfaReading) {
      state.qfaAdmiraltyReadings = dataSort.addOjectToList({
        targetArray: state.qfaAdmiraltyReadings,
        newObject: qfaReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaAdmiraltyReadings(state, qfaAdmiraltyReadings) {
      state.qfaAdmiraltyReadings = dataSort.populateList({
        targetArray: state.qfaAdmiraltyReadings,
        newArray: qfaAdmiraltyReadings,
        sortBy: "created_at",
        sortOrder: "desc"
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
    async getQfaAdmiraltyReadings({ commit, state }, $this) {
      $this.qfaAdmiraltyReadingsLoading = true;
      const { pagination, qfaAdmiraltyReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaAdmiraltyReadingsRangeBy = null,
        qfaAdmiraltyReadingsRangeFrom = null,
        qfaAdmiraltyReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaAdmiraltyReadingsLoading = false;
        return ($this.qfaAdmiraltyReadings = qfaAdmiraltyReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-admiralty-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaAdmiraltyReadingsRangeBy,
            rangeFrom: qfaAdmiraltyReadingsRangeFrom,
            rangeTo: qfaAdmiraltyReadingsRangeTo
          }
        });
        commit("setQfaAdmiraltyReadings", response.data.data);
        $this.qfaAdmiraltyReadings = response.data.data;
        $this.qfaAdmiraltyReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
