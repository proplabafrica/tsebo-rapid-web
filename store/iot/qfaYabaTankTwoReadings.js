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
    qfaYabaTankTwoReadings: [],
    refresh: true
  }),
  mutations: {
    setQfaYabaTankTwoReading(state, qfaReading) {
      state.qfaYabaTankTwoReadings = dataSort.addOjectToList({
        targetArray: state.qfaYabaTankTwoReadings,
        newObject: qfaReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaYabaTankTwoReadings(state, qfaYabaTankTwoReadings) {
      state.qfaYabaTankTwoReadings = dataSort.populateList({
        targetArray: state.qfaYabaTankTwoReadings,
        newArray: qfaYabaTankTwoReadings,
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
    async getQfaYabaTankTwoReadings({ commit, state }, $this) {
      $this.qfaYabaTankTwoReadingsLoading = true;
      const { pagination, qfaYabaTankTwoReadings, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaYabaTankTwoReadingsRangeBy = null,
        qfaYabaTankTwoReadingsRangeFrom = null,
        qfaYabaTankTwoReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaYabaTankTwoReadingsLoading = false;
        return ($this.qfaYabaTankTwoReadings = qfaYabaTankTwoReadings);
      }
      try {
        const response = await $axios.get("iot/qfa-yaba-tank-two-readings", {
          params: {
            page,
            perPage,
            rangeBy: qfaYabaTankTwoReadingsRangeBy,
            rangeFrom: qfaYabaTankTwoReadingsRangeFrom,
            rangeTo: qfaYabaTankTwoReadingsRangeTo
          }
        });
        commit("setQfaYabaTankTwoReadings", response.data.data);
        $this.qfaYabaTankTwoReadings = response.data.data;
        $this.qfaYabaTankTwoReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
