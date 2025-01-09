import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["materials"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    materialCategories: [],
    refresh: true
  }),
  mutations: {
    setMaterialCategory(state, materialCategory) {
      state.materialCategories = dataSort.addOjectToList({
        targetArray: state.materialCategories,
        newObject: materialCategory,
        sortBy: "name"
      });
    },
    setMaterialCategories(state, materialCategories) {
      state.materialCategories = dataSort.populateList({
        targetArray: state.materialCategories,
        newArray: materialCategories,
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
    async getMaterialCategories({ commit, state }, $this) {
      const { associations, pagination, materialCategories, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.materialCategoriesLoading = false;
        return ($this.materialCategories = materialCategories);
      }

      try {
        const response = await $this.$axios.get("material-categories", {
          params: { associations, page, perPage }
        });
        commit("setMaterialCategories", response.data.data);
        commit("setPagination", response.data);
        $this.materialCategories = response.data.data;
        $this.materialCategoriesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
