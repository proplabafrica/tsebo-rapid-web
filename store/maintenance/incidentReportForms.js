import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      sortBy: "updated_at",
      sortOrder: "desc",
      lastPage: null
    },
    incidentReportForms: [],
    refresh: true
  }),
  mutations: {
    setIncidentReportForm(state, incidentReport) {
      state.incidentReportForms = dataSort.addOjectToList({
        targetArray: state.incidentReportForms,
        newObject: incidentReport,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setIncidentReportForms(state, incidentReport) {
      state.incidentReportForms = dataSort.populateList({
        targetArray: state.incidentReportForms,
        newArray: incidentReport,
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
    async getIncidentReportForms({ commit, state }, $this) {
      $this.incidentReportFormsLoading = true;
      var { associations, incidentReportForms, pagination, refresh } = state;
      const { page, perPage, sortBy, sortOrder } = pagination;
      const {
        $axios,
        incidentReportFormsPerPage = perPage,
        incidentReportFormsSortBy = sortBy,
        incidentReportFormsSortOrder = sortOrder
      } = $this;

      if (refresh == false) {
        $this.incidentReportFormsLoading = false;
        return ($this.incidentReportForms = incidentReportForms);
      }

      try {
        const response = await $axios.get("incident-report-forms", {
          params: {
            associations,
            page,
            perPage: incidentReportFormsPerPage,
            sortBy: incidentReportFormsSortBy,
            sortOrder: incidentReportFormsSortOrder
          }
        });

        commit("setIncidentReportForms", response.data.data);
        $this.incidentReportForms = response.data.data;
        $this.incidentReportFormsLoading = false;
        if (incidentReportFormSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
