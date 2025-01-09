import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true,
    trades: []
  }),
  mutations: {
    setTrade(state, trade) {
      state.trades = dataSort.addOjectToList({
        targetArray: state.trades,
        newObject: trade,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setTrades(state, trades) {
      state.trades = dataSort.populateList({
        targetArray: state.trades,
        newArray: trades,
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
    async getTrades({ commit, state }, $this) {
      var { associations, pagination, trades: storedTrades, refresh } = state;
      const { page, perPage } = pagination;
      var { $axios, tradeSearch } = $this;

      if (refresh == false && !tradeSearch) {
        $this.tradesLoading = false;
        return ($this.trades = storedTrades);
      }

      try {
        const response = await $axios.get("trades", {
          params: {
            associations,
            page,
            perPage,
            search: tradeSearch
          }
        });
        commit("setTrades", response.data.data);
        $this.trades = response.data.data;
        $this.tradesLoading = false;
        if (tradeSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
