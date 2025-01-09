import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    associations: [
      "baseHierarchies.units",
      "contacts",
      "subscriptions.package",
      "types",
      "addresses",
      "subscriptions",
      "files",
      "industries"
    ],
    detailedAssociations: [
      "addresses",
      "baseHierarchies.children",
      "baseHierarchies.organization",
      "baseHierarchies.units",
      "contacts",
      "industries",
      "roles",
      "subscriptions.package",
      "types",
    ],
    organizations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setOrganization(state, organization) {
      state.organizations = dataSort.addOjectToList({
        targetArray: state.organizations,
        newObject: organization,
        sortBy: "name"
      });
    },
    setOrganizations(state, organizations) {
      state.organizations = dataSort.populateList({
        targetArray: state.organizations,
        newArray: organizations,
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
    async getOrganizations({ commit, state }, $this) {
      $this.organizationsLoading = true;
      var { associations, organizations, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        organizationAssociations = associations,
        organizationSearch = null,
        organizationsPerPage = perPage,
        organizationsSortBy = "name",
        organizationsSortOrder = "asc"
      } = $this;

      if (refresh == false && !organizationSearch) {
        $this.organizationsLoading = false;
        return ($this.organizations = organizations);
      }

      try {
        const response = await $axios.get("organizations", {
          params: {
            associations: organizationAssociations,
            page,
            perPage: organizationsPerPage,
            search: organizationSearch,
            sortBy: organizationsSortBy,
            sortOrder: organizationsSortOrder
          }
        });
        $this.organizations = response.data.data;
        $this.organizationsLoading = false;
        commit("setOrganizations", response.data.data);
        if (organizationSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
