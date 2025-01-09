import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["trades", "currency"],
    detailedAssociations: ["trades", "currency"],
    pagination: {
      total: 0,
      perPage: 1000000,
      page: 1,
      lastPage: null
    },
    refresh: true,
    services: []
  }),
  mutations: {
    setService(state, service) {
      state.services = dataSort.addOjectToList({
        targetArray: state.services,
        newObject: service,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setServices(state, services) {
      state.services = dataSort.populateList({
        targetArray: state.services,
        newArray: services,
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
    async getServices({ commit, state }, $this) {
      $this.servicesLoading = true;
      const { associations, services, pagination, refresh } = state;
      const { page, perPage } = pagination;
      const { $axios, serviceSearch } = $this;

      if (refresh == false && !serviceSearch) {
        $this.servicesLoading = false;
        return ($this.services = services);
      }

      try {
        const response = await $axios.get("services", {
          params: { associations, page, perPage, search: serviceSearch }
        });
        commit("setServices", response.data.data);

        console.log("first service", response.data.data)
        $this.services = response.data.data;
        $this.servicesLoading = false;
        if (serviceSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
