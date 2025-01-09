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
    qfaOverheadReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaOverheadReading(state, qfaOverheadReading) {
      state.qfaOverheadReadings = dataSort.addOjectToList({
        targetArray: state.qfaOverheadReadings,
        newObject: qfaOverheadReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaOverheadReadings(state, qfaOverheadReadings) {
      state.qfaOverheadReadings = dataSort.populateList({
        targetArray: state.qfaOverheadReadings,
        newArray: qfaOverheadReadings,
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
    async getQfaOverheadReadings({ commit, state }, $this) {
      $this.qfaOverheadReadingsLoading = true;
      const { pagination, qfaOverheadReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaOverheadReadingsRangeBy = null,
        qfaOverheadReadingsRangeFrom = null,
        qfaOverheadReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaOverheadReadingsLoading = false;
        return ($this.qfaOverheadReadings = qfaOverheadReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-overhead-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaOverheadReadingsRangeBy,
            rangeFrom: qfaOverheadReadingsRangeFrom,
            rangeTo: qfaOverheadReadingsRangeTo
          }
        });
        commit("setQfaOverheadReadings", response.data.data);
        $this.qfaOverheadReadings = response.data.data;
        $this.qfaOverheadReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
