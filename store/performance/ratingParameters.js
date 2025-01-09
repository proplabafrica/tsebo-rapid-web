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
    ratingParameters: [],
    refresh: true
  }),
  mutations: {
    setRatingParameter(state, ratingParameter) {
      state.ratingParameters = dataSort.addOjectToList({
        targetArray: state.ratingParameters,
        newObject: ratingParameter,
        sortBy: "name",
        sortOrder: "asc"
      });
    },
    setRatingParameters(state, ratingParameters) {
      state.ratingParameters = dataSort.populateList({
        targetArray: state.ratingParameters,
        newArray: ratingParameters,
        sortBy: "name",
        sortOrder: "asc"
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
    async getRatingParameters({ commit, state }, $this) {
      $this.ratingParametersLoading = true;
      const { $axios, entityCodes = [], ratingParameterSearch } = $this;
      const { associations, pagination, ratingParameters, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false && !ratingParameterSearch) {
        $this.ratingParametersLoading = false;
        return ($this.ratingParameters = ratingParameters);
      }

      try {
        const response = await $axios.get("rating-parameters", {
          params: {
            associations,
            entityCodes,
            page,
            perPage,
            search: ratingParameterSearch
          }
        });
        commit("setRatingParameters", response.data.data);
        $this.ratingParameters = response.data.data;
        $this.ratingParametersLoading = false;
        if (ratingParameterSearch) commit("toggleRefresh");
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
