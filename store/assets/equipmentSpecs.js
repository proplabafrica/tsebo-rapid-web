import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["categories", "brands", "capacities"],
    detailedAssociations: [],
    equipmentSpecs: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipmentSpec(state, equipmentSpec) {
      state.equipmentSpecs = dataSort.addOjectToList({
        targetArray: state.equipmentSpecs,
        newObject: equipmentSpec,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setEquipmentSpecs(state, equipmentSpecs) {
      state.equipmentSpecs = dataSort.populateList({
        targetArray: state.equipmentSpecs,
        newArray: equipmentSpecs,
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
    async getEquipmentSpecs({ commit, state }, $this) {
      var {
        associations,
        pagination,
        equipmentSpecs: storedEquipmentSpecs,
        refresh
      } = state;
      const { page, perPage } = pagination;
      var { $axios, equipmentSpecSearch = null } = $this;

      if (refresh == false && !equipmentSpecSearch) {
        $this.equipmentSpecsLoading = false;
        return ($this.equipmentSpecs = storedEquipmentSpecs);
      }

      try {
        const response = await $axios.get("equipment-specifications", {
          params: {
            associations,
            page,
            perPage,
            search: equipmentSpecSearch
          }
        });
        $this.equipmentSpecs = response.data.data;
        $this.equipmentSpecsLoading = false;
        commit("setEquipmentSpecs", response.data.data);
        if (equipmentSpecSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
