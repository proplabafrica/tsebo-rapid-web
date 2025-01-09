import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "createdBy.roles",
      "currency",
      "status",
      "purchaseOrderStatus",
      "quotation.tenderProcess.workRequests",
      "quotation.tenderProcess.salesOrders.workRequests",
      "quotation.tenderProcess.salesOrders.workRequests.status",
      "quotation.tenderProcess.salesOrders.workRequests.logs.status",
      "quotation.tenderProcess.salesOrders.workRequests.priority",
      "quotation.tenderProcess.salesOrders.workRequests.sla.measurement",
      "quotation.tenderProcess.salesOrders.workRequests.sla.priority",
      "quotation.tenderProcess.salesOrders.workRequests.unit",
      "vendor"
    ],
    detailedAssociations: [
      "createdBy.roles",
      "currency",
      "deliveryLogs.createdBy",
      "deliveryLogs.status",
      "items.deliveryLogs.status",
      "items.quotationItem.tenderItem.deliveryType",
      "items.quotationItem.tenderItem.material",
      "items.quotationItem.tenderItem.service",
      "items.status",
      "purchaseOrderStatus",
      "logs.createdBy.roles",
      "logs.comment",
      "logs",
      "paymentSchedules.status",
      "transactions",
      "modifiers",
      "paymentTerm",
      "quotation.files",
      "quotation.docLinks",
      "quotation.tenderProcess.workRequests",
      "quotation.tenderProcess.salesOrders.workRequests",
      "quotation.tenderProcess.salesOrders.workRequests.unit",
      "status",
      "terms",
      "vendor",
    ],
    pagination: {
      total: 0,
      perPage: 2000,
      page: 1,
      lastPage: null
    },
    purchaseOrders: [],
    purchaseOrdersColumnData: {},
    refresh: true,
  }),
  mutations: {
    setPurchaseOrder(state, purchaseOrder) {
      state.purchaseOrders = dataSort.addOjectToList({
        targetArray: state.purchaseOrders,
        newObject: purchaseOrder,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setPurchaseOrders(state, purchaseOrders) {
      state.purchaseOrders = dataSort.populateList({
        targetArray: state.purchaseOrders,
        newArray: purchaseOrders,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    setPurchaseOrderColumnData(state, { column, data }) {
      state.purchaseOrdersColumnData[column] = data;
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
    async getPurchaseOrders({ commit, state }, $this) {
      $this.purchaseOrdersLoading = true;
      var {
        associations,
        pagination,
        detailedAssociations,
        byStatusCodes,
        purchaseOrders,
        refresh
      } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        posPerPage = perPage,
        poSearch,
        poSortBy = "created_at",
        poSortOrder = "desc",
        poStatusCodes = [],
        byPurchaseOrderStatusCodes = [],
        poPaymentTermId,
        purchaseOrdersRangeBy,
        purchaseOrdersRangeFrom,
        purchaseOrdersRangeTo,
        duration
      } = $this;

      if (refresh == false && !poSearch) {
        $this.purchaseOrdersLoading = false;
        return ($this.purchaseOrders = purchaseOrders);
      }
      try {
        const response = await $axios.get("purchase-orders", {
          params: {
            associations: detailedAssociations,
            duration,
            page,
            perPage: posPerPage,
            search: poSearch,
            statusCodes: poStatusCodes,
            sortBy: poSortBy,
            sortOrder: poSortOrder,
            byStatusCodes: poStatusCodes,
            byPurchaseOrderStatusCodes,
            byPaymentTermId: poPaymentTermId,
            rangeBy: purchaseOrdersRangeBy,
            rangeFrom: purchaseOrdersRangeFrom,
            rangeTo: purchaseOrdersRangeTo
          }
        });

        commit("setPurchaseOrders", response.data.data);
        $this.purchaseOrders = response.data.data;
        $this.purchaseOrdersLoading = false;
        if (poSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  }
};
