import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "events.trigger",
      "headers",
      "params",
      "verb",
      "organization"
    ],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    webHooks: [],
    refresh: true
  }),
  mutations: {
    setWebHook(state, webHook) {
      state.webHooks = dataSort.addOjectToList({
        targetArray: state.webHooks,
        newObject: webHook,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setWebHooks(state, webHooks) {
      state.webHooks = dataSort.populateList({
        targetArray: state.webHooks,
        newArray: webHooks,
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
    async getWebHooks({ commit, state }, $this) {
      $this.webHooksLoading = true;
      const { associations, pagination, webHooks, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.webHooksLoading = false;
        return ($this.webHooks = webHooks);
      }

      try {
        const response = await $this.$axios.get("web-hooks", {
          params: { associations, page, perPage }
        });
        // response.data.data);
        commit("setWebHooks", response.data.data);
        commit("setPagination", response.data);
        $this.webHooks = response.data.data;
        $this.webHooksLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
