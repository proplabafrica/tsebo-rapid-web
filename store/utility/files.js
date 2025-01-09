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
    refresh: true,
    files: []
  }),
  mutations: {
    setFile(state, file) {
      state.files = dataSort.addOjectToList({
        targetArray: state.files,
        newObject: file,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setFiles(state, files) {
      state.files = dataSort.populateList({
        targetArray: state.files,
        newArray: files,
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
    async getFiles({ commit, state }, $this) {
      $this.workRequestsLoading = true;
      var { associations, files, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        fileEquipmentIds = null,
        fileSearch = null,
        filesSortBy = null,
        filesSortOrder = null
      } = $this;

      if (refresh == false && !fileSearch) {
        $this.filesLoading = false;
        return ($this.files = files);
      }

      try {
        const response = await $axios.get("files", {
          params: {
            associations,
            byEquipmentIds: fileEquipmentIds,
            page,
            perPage,
            search: fileSearch,
            sortBy: filesSortBy,
            sortOrder: filesSortOrder
          }
        });
        $this.files = response.data.data;
        $this.filesLoading = false;
        commit("setFiles", response.data.data);
        if (fileSearch) commit("toggleRefresh");
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
