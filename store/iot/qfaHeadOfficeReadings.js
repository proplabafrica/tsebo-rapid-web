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
    qfaHeadOfficeReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaHeadOfficeReading(state, qfaReading) {
      state.qfaHeadOfficeReadings = dataSort.addOjectToList({
        targetArray: state.qfaHeadOfficeReadings,
        newObject: qfaReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaHeadOfficeReadings(state, qfaHeadOfficeReadings) {
      state.qfaHeadOfficeReadings = dataSort.populateList({
        targetArray: state.qfaHeadOfficeReadings,
        newArray: qfaHeadOfficeReadings,
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
    async getQfaHeadOfficeReadings({ commit, state }, $this) {
      $this.qfaHeadOfficeReadingsLoading = true;
      const { pagination, qfaHeadOfficeReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaHeadOfficeReadingsRangeBy = null,
        qfaHeadOfficeReadingsRangeFrom = null,
        qfaHeadOfficeReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaHeadOfficeReadingsLoading = false;
        return ($this.qfaHeadOfficeReadings = qfaHeadOfficeReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-head-office-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaHeadOfficeReadingsRangeBy,
            rangeFrom: qfaHeadOfficeReadingsRangeFrom,
            rangeTo: qfaHeadOfficeReadingsRangeTo
          }
        });
        commit("setQfaHeadOfficeReadings", response.data.data);
        $this.qfaHeadOfficeReadings = response.data.data;
        $this.qfaHeadOfficeReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
