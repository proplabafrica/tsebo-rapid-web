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
    webHookVerbs: [],
    refresh: true
  }),
  mutations: {
    setWebHookVerb(state, webHookVerb) {
      state.webHookVerbs = dataSort.addOjectToList({
        targetArray: state.webHookVerbs,
        newObject: webHookVerb,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setWebHookVerbs(state, webHookVerbs) {
      state.webHookVerbs = dataSort.populateList({
        targetArray: state.webHookVerbs,
        newArray: webHookVerbs,
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
    async getWebHookVerbs({ commit, state }, $this) {
      const { associations, pagination, webHookVerbs, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.webHookVerbsLoading = false;
        return ($this.webHookVerbs = webHookVerbs);
      }

      try {
        const response = await $this.$axios.get("web-hook-verbs", {
          params: { associations, page, perPage }
        });
        commit("setWebHookVerbs", response.data.data);
        commit("setPagination", response.data);
        $this.webHookVerbs = response.data.data;
        $this.webHookVerbsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
