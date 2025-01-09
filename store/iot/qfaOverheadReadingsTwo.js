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
    qfaOverheadReadingsTwo: [],
    refresh: true
  }),
  mutations: {
    setQfaOverheadReadingTwo(state, qfaOverheadReadingTwo) {
      state.qfaOverheadReadingsTwo = dataSort.addOjectToList({
        targetArray: state.qfaOverheadReadingsTwo,
        newObject: qfaOverheadReadingTwo,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQfaOverheadReadingsTwo(state, qfaOverheadReadingsTwo) {
      state.qfaOverheadReadingsTwo = dataSort.populateList({
        targetArray: state.qfaOverheadReadingsTwo,
        newArray: qfaOverheadReadingsTwo,
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
    async getQfaOverheadReadingsTwo({ commit, state }, $this) {
      $this.qfaOverheadReadingsTwoLoading = true;
      const { pagination, qfaOverheadReadingsTwo, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        qfaOverheadReadingsTwoRangeBy = null,
        qfaOverheadReadingsTwoRangeFrom = null,
        qfaOverheadReadingsTwoRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.qfaOverheadReadingsTwoLoading = false;
        return ($this.qfaOverheadReadingsTwo = qfaOverheadReadingsTwo);
      }

      try {
        const response = await $axios.get("iot/qfa-overhead-readings-two", {
          params: {
            page,
            perPage,
            rangeBy: qfaOverheadReadingsTwoRangeBy,
            rangeFrom: qfaOverheadReadingsTwoRangeFrom,
            rangeTo: qfaOverheadReadingsTwoRangeTo
          }
        });
        commit("setQfaOverheadReadingsTwo", response.data.data);
        $this.qfaOverheadReadingsTwo = response.data.data;
        $this.qfaOverheadReadingsTwoLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
