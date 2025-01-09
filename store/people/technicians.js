import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["feedbacks", "user"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true,
    technicians: []
  }),
  mutations: {
    setTechnician(state, technician) {
      state.technicians = dataSort.addOjectToList({
        targetArray: state.technicians,
        newObject: technician,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setTechnicians(state, technicians) {
      state.technicians = dataSort.populateList({
        targetArray: state.technicians,
        newArray: technicians,
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
    async getTechnicians({ commit, state }, $this) {
      var { associations, pagination, refresh, technicians } = state;
      const { page, perPage } = pagination;
      var { $axios } = $this;

      if (refresh == false) {
        $this.techniciansLoading = false;
        return ($this.technicians = technicians);
      }

      try {
        const response = await $axios.get("technicians", {
          params: { associations, page, perPage }
        });
        commit("setTechnicians", response.data.data);
        $this.technicians = response.data.data.map(technician => {
          technician.name = technician.user.name;
          return technician;
        });
        $this.techniciansLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
