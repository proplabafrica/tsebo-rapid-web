import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["categories", "currency"],
    detailedAssociations: ["categories", "currency"],
    materials: [],
    pagination: {
      total: 0,
      perPage: 10000,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setMaterial(state, material) {
      state.materials = dataSort.addOjectToList({
        targetArray: state.materials,
        newObject: material,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setMaterials(state, materials) {
      state.materials = dataSort.populateList({
        targetArray: state.materials,
        newArray: materials,
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
    async getMaterials({ commit, state }, $this) {
      $this.materialsLoading = true;
      const { associations, materials, pagination, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        materialSearch,
        materialsRangeBy,
        materialsRangeFrom,
        materialsRangeTo
      } = $this;

      if (refresh == false && !materialSearch) {
        $this.materialsLoading = false;
        return ($this.materials = materials);
      }

      try {
        const response = await $axios.get("materials", {
          params: {
            associations,
            page,
            perPage,
            search: materialSearch,
            rangeBy: materialsRangeBy,
            rangeFrom: materialsRangeFrom,
            rangeTo: materialsRangeTo
          }
        });
        commit("setMaterials", response.data.data);
        $this.materials = response.data.data;
        $this.materialsLoading = false;
        if (materialSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
