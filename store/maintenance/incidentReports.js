import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["reporter.roles", "status", "unit.parent", "reportForm"],
    detailedAssociations: [
      "files",
      "logs.comment",
      "logs.createdBy.roles",
      "reporter.roles",
      "unit.hierarchy",
      "unit.parent",
      "status"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      sortBy: "updated_at",
      sortOrder: "desc",
      lastPage: null
    },
    incidentReports: [],
    refresh: true
  }),
  mutations: {
    setIncidentReport(state, incidentReport) {
      state.incidentReports = dataSort.addOjectToList({
        targetArray: state.incidentReports,
        newObject: incidentReport,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setIncidentReports(state, incidentReport) {
      state.incidentReports = dataSort.populateList({
        targetArray: state.incidentReports,
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
    async getIncidentReports({ commit, state }, $this) {
      $this.incidentReportsLoading = true;
      var { associations, incidentReports, pagination, refresh } = state;
      const { page, perPage, sortBy, sortOrder } = pagination;
      const {
        $axios,
        incidentReportSearch = null,
        incidentReportStatusCodes,
        incidentReportsPerPage = perPage,
        incidentReportsSortBy = sortBy,
        incidentReportsSortOrder = sortOrder
      } = $this;

      if (refresh == false && !incidentReportSearch) {
        $this.incidentReportsLoading = false;
        return ($this.incidentReports = incidentReports);
      }

      try {
        const response = await $axios.get("incident-reports", {
          params: {
            associations,
            byStatusCodes: incidentReportStatusCodes,
            page,
            perPage: incidentReportsPerPage,
            search: incidentReportSearch,
            sortBy: incidentReportsSortBy,
            sortOrder: incidentReportsSortOrder
          }
        });

        if (!incidentReportSearch)
          commit("setIncidentReports", response.data.data);
        $this.incidentReports = response.data.data;
        $this.incidentReportsLoading = false;
        if (incidentReportSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
