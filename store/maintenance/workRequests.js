import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    allStatusCodes: ["01", "05", "20", "35", "100", "105", "60", "65", "80"],
    associations: [
      "createdBy.facilityManagers",
      "createdBy.procurementOfficers",
      "invoices.status",
      "logs.status",
      "logs.createdBy.roles",
      "unit.parent",
      "priority",
      "sla.measurement",
      "sla.priority",
      "status",
      "ratings"
    ],
    detailedAssociations: [
      "children",
      "clientRequest.files",
      "clientRequest.equipment",
      "equipment",
      "items.deliveryType",
      "items.material",
      "items.materialCost",
      "items.service",
      "items.serviceCost",
      "invoices.status",
      "jobSchedules.plan",
      "logs.comment",
      "logs.createdBy",
      "logs.status",
      "priority",
      "ratings",
      "salesOrders.logs.status",
      "salesOrders.tenderProcesses.quotations.status",
      "sla.measurement",
      "sla.priority",
      "status",
      "technicians.user",
      "tenderProcesses.quotations.status",
      "tenderProcesses.logs.comment",
      "tenderProcesses.logs.createdBy",
      "trades",
      "type",
      "unit.equipment",
      "unit.hierarchy",
      "unit.parent.hierarchy"
    ],
    pagination: {
      total: 0,
      perPage: 50,
      page: 1,
      lastPage: null
    },
    slaStatusCodes: ["01", "05", "20", "35", "60", "65"],
    workRequests: [],
    workRequestColumnData: {},
    refresh: true
  }),
  mutations: {
    setWorkRequest(state, workRequest) {
      state.workRequests = dataSort.addOjectToList({
        targetArray: state.workRequests,
        newObject: workRequest,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setWorkRequests(state, workRequests) {
      state.workRequests = dataSort.populateList({
        targetArray: state.workRequests,
        newArray: workRequests,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    setWorkRequestColumnData(state, { column, data }) {
      state.workRequestColumnData[column] = data;
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
    async getWorkRequests({ commit, state }, $this) {
      $this.workRequestsLoading = true;
      var { associations, workRequests, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        workRequestAssociations = associations,
        workRequestsPerPage = perPage,
        workRequestsRangeBy = null,
        workRequestsRangeFrom = null,
        workRequestsRangeTo = null,
        workRequestSearch = null,
        workRequestStatusCodes = [],
        workRequestsSortBy = "created_at",
        workRequestsSortOrder = "asc",
        workRequestsUnitId = null,
        workRequestsOrganizationId = null,
        workRequestUserId = null,
        workRequestsEquipmentIds = [],
        workRequestsJobScheduleIds = []
      } = $this;

      if (refresh == false && !workRequestSearch) {
        $this.workRequestsLoading = false;
        return ($this.workRequests = workRequests);
      }

      try {
        const response = await $axios.get("work-requests", {
          params: {
            associations: workRequestAssociations,
            byStatusCodes: workRequestStatusCodes,
            byUnitId: workRequestsUnitId,
            byUserId: workRequestUserId,
            byOrganizationId: workRequestsOrganizationId,
            byEquipmentIds: workRequestsEquipmentIds,
            byJobScheduleIds: workRequestsJobScheduleIds,
            page,
            perPage: workRequestsPerPage,
            rangeBy: workRequestsRangeBy,
            rangeFrom: workRequestsRangeFrom,
            rangeTo: workRequestsRangeTo,
            search: workRequestSearch,
            sortBy: workRequestsSortBy,
            sortOrder: workRequestsSortOrder
          }
        });
        $this.workRequests = response.data.data;
        $this.workRequestsLoading = false;
        commit("setWorkRequests", response.data.data);
        if (workRequestSearch) commit("toggleRefresh");
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
