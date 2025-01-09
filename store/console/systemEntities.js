import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["params", "eventTriggers"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    systemEntities: [],
    refresh: true
  }),
  mutations: {
    setSystemEntity(state, systemEntity) {
      state.systemEntities = dataSort.addOjectToList({
        targetArray: state.systemEntities,
        newObject: systemEntity,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSystemEntities(state, systemEntities) {
      state.systemEntities = dataSort.populateList({
        targetArray: state.systemEntities,
        newArray: systemEntities,
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
    async getSystemEntities({ commit, state }, $this) {
      const { associations, pagination, systemEntities, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.systemEntitiesLoading = false;
        return ($this.systemEntities = systemEntities);
      }

      try {
        const response = await $this.$axios.get("system-entities", {
          params: { associations, page, perPage }
        });
        commit("setSystemEntities", response.data.data);
        commit("setPagination", response.data);
        $this.systemEntities = response.data.data;
        $this.systemEntitiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
