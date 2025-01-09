import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["parameter", "rateable"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    ratings: [],
    refresh: true
  }),
  mutations: {
    setRating(state, rating) {
      state.ratings = dataSort.addOjectToList({
        targetArray: state.ratings,
        newObject: rating,
        sortBy: "name",
        sortOrder: "asc"
      });
    },
    setRatings(state, ratings) {
      state.ratings = dataSort.populateList({
        targetArray: state.ratings,
        newArray: ratings,
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
    async getRatings({ commit, state }, $this) {
      $this.ratingsLoading = true;
      const {
        $axios,
        parameterCodes = [],
        rateableCode = null,
        ratingSearch = null
      } = $this;
      const { associations, pagination, ratings, refresh } = state;
      const { page, perPage } = pagination;

      if (refresh == false && !ratingSearch) {
        $this.ratingsLoading = false;
        return ($this.ratings = ratings);
      }

      try {
        const response = await $axios.get("ratings", {
          params: {
            associations,
            page,
            parameterCodes,
            perPage,
            rateableCode,
            search: ratingSearch
          }
        });
        $this.ratings = response.data.data;
        $this.ratingsLoading = false;
        if (ratingSearch) commit("toggleRefresh");
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
