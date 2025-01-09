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
    qfaYabaTankOneReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaYabaTankOneReading(state, qfaReading) {
      state.qfaYabaTankOneReadings = dataSort.addOjectToList({
        targetArray: state.qfaYabaTankOneReadings,
        newObject: qfaReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaYabaTankOneReadings(state, qfaYabaTankOneReadings) {
      state.qfaYabaTankOneReadings = dataSort.populateList({
        targetArray: state.qfaYabaTankOneReadings,
        newArray: qfaYabaTankOneReadings,
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
    async getQfaYabaTankOneReadings({ commit, state }, $this) {
      $this.qfaYabaTankOneReadingsLoading = true;
      const { pagination, qfaYabaTankOneReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaYabaTankOneReadingsRangeBy = null,
        qfaYabaTankOneReadingsRangeFrom = null,
        qfaYabaTankOneReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaYabaTankOneReadingsLoading = false;
        return ($this.qfaYabaTankOneReadings = qfaYabaTankOneReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-yaba-tank-one-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaYabaTankOneReadingsRangeBy,
            rangeFrom: qfaYabaTankOneReadingsRangeFrom,
            rangeTo: qfaYabaTankOneReadingsRangeTo
          }
        });
        commit("setQfaYabaTankOneReadings", response.data.data);
        $this.qfaYabaTankOneReadings = response.data.data;
        $this.qfaYabaTankOneReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
