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
    qfaYabaReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaYabaReading(state, qfaReading) {
      state.qfaYabaReadings = dataSort.addOjectToList({
        targetArray: state.qfaYabaReadings,
        newObject: qfaReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaYabaReadings(state, qfaYabaReadings) {
      state.qfaYabaReadings = dataSort.populateList({
        targetArray: state.qfaYabaReadings,
        newArray: qfaYabaReadings,
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
    async getQfaYabaReadings({ commit, state }, $this) {
      $this.qfaYabaReadingsLoading = true;
      const { pagination, qfaYabaReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaYabaReadingsRangeBy = null,
        qfaYabaReadingsRangeFrom = null,
        qfaYabaReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaYabaReadingsLoading = false;
        return ($this.qfaYabaReadings = qfaYabaReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-yaba-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaYabaReadingsRangeBy,
            rangeFrom: qfaYabaReadingsRangeFrom,
            rangeTo: qfaYabaReadingsRangeTo
          }
        });
        commit("setQfaYabaReadings", response.data.data);
        $this.qfaYabaReadings = response.data.data;
        $this.qfaYabaReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
