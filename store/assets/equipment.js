import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "specification.brands",
      "specification.categories",
      "specification.capacities",
      "unit"
    ],
    detailedAssociations: [
      "files",
      "oemLifeCycleMeasurement",
      "specification.brands",
      "specification.categories",
      "specification.capacities",
      "unit"
    ],
    equipment: [],
    pagination: {
      total: 0,
      perPage: 8000,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipment(state, equipment) {
      state.equipment = dataSort.addOjectToList({
        targetArray: state.equipment,
        newObject: equipment,
        sortBy: "name"
      });
    },
    setEquipmentList(state, equipment) {
      state.equipment = dataSort.populateList({
        targetArray: state.equipment,
        newArray: equipment,
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
    async getEquipmentList({ commit, state }, $this) {
      var {
        associations,
        pagination,
        equipment: storedEquipmentList,
        refresh
      } = state;
      const { page, perPage } = pagination;
      var {
        $axios,
        equipmentListByUnitIds = [],
        equipmentListSearch = null
      } = $this;

      if (refresh == false && !equipmentListSearch) {
        $this.equipmentListLoading = false;
        return ($this.equipmentList = storedEquipmentList);
      } 

      try {
        const response = await $axios.get("equipment", {
          params: {
            associations,
            byUnitIds: equipmentListByUnitIds,
            page,
            perPage,
            search: equipmentListSearch
          }
        });
        commit("setEquipmentList", response.data.data);
        $this.equipmentList = response.data.data;
        $this.equipmentListLoading = false;
        if (equipmentListSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
