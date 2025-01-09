import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "createdBy.roles",
      "requesters",
      "status",
      "type",
      "workRequests.status",
      "workRequests.logs.status",
      "workRequests.priority",
      "workRequests.sla.measurement",
      "workRequests.sla.priority",
      "workRequests.unit"
    ],
    detailedAssociations: [
      "currency",
      "items.materialCost.currency",
      "items.material.currency",
      "logs.comment",
      "logs.createdBy",
      "logs.status",
      "requesters",
      "status",
      "tenderProcesses",
      "workRequests.unit",
      "type"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    salesOrders: [],
    refresh: true,
    salesOrderTypes: []
  }),
  mutations: {
    setSalesOrder(state, salesOrder) {
      state.salesOrders = dataSort.addOjectToList({
        targetArray: state.salesOrders,
        newObject: salesOrder,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSalesOrders(state, salesOrders) {
      state.salesOrders = dataSort.populateList({
        targetArray: state.salesOrders,
        newArray: salesOrders,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    setSalesOrderTypes(state, salesOrderTypes) {
      state.salesOrderTypes = dataSort.populateList({
        targetArray: state.salesOrderTypes,
        newArray: salesOrderTypes,
        sortBy: "name"
      });
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
    async getSalesOrders({ commit, state }, $this) {
      $this.salesOrdersLoading = true;
      const { associations, pagination, salesOrders, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        salesOrderSearch,
        salesOrderStatusCodes = [],
        salesOrdersRangeBy = null,
        salesOrdersRangeFrom,
        salesOrdersRangeTo,
        unitId
      } = $this;


      console.log(salesOrderStatusCodes, "CODES")
      if (refresh == false && !salesOrderSearch && !unitId) {
        $this.salesOrdersLoading = false;
        return ($this.salesOrders = salesOrders);
      }

      console.log(unitId, "UNIT ID")
      try {
        const response = await $axios.get("sales-orders", {
          params: {
            associations,
            page,
            perPage,
            search: salesOrderSearch,
            statusCodes: salesOrderStatusCodes,
            rangeBy: salesOrdersRangeBy,
            rangeFrom: salesOrdersRangeFrom,
            rangeTo: salesOrdersRangeTo,
            byUnitId: unitId
          }
        });
        commit("setSalesOrders", response.data.data);
        $this.salesOrders = response.data.data;

        console.log("sales order..", response.data.data)
        $this.salesOrdersLoading = false;
        if (salesOrderSearch || unitId) commit("toggleRefresh");
        return;
      } catch (error) {
        $this.salesOrders = salesOrders;
        $this.salesOrdersLoading = false;

        console.log(error);
      }
      return;
    },
    async getSalesOrdersCount({ state }, $this) {
      $this.salesOrdersLoading = true;
      const { $axios, salesOrderSearch, salesOrderStatusCodes = [] } = $this;

      try {
        const response = await $axios.get("sales-orders/get-count", {
          params: {
            search: salesOrderSearch,
            statusCodes: salesOrderStatusCodes
          }
        });
        $this.salesOrdersCount = response.data.count;
      } catch (error) {
        console.log(error);
      }
      return;
    },
    async getSalesOrderTypes({ commit, state }, $this) {
      const { $axios } = $this;
      const { salesOrderTypes } = state;

      if (salesOrderTypes.length > 0)
        return ($this.salesOrderTypes = salesOrderTypes);

      try {
        const response = await $axios.get("sales-order-types");
        commit("setSalesOrderTypes", response.data.data);
        $this.salesOrderTypes = response.data.data;
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  }
};
