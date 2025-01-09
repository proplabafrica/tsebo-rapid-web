<template>
  <div class="container">
    <div class="wrapper" @click="openModal" v-if="!showModal">
      <img src="/img/download.png" class="spool-download" />
    </div>
    <div class="modal fade show" v-if="showModal">
      <div class="modal-dialog wd-300 wd-sm-500">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <div>
              <form class="body pd-20">
                <div class="header">
                  <h3 class="slim-card-title">REPORT SPOOLING</h3>
                  <button class="close" @click="openModal">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <label class="form-control-label">Category:</label>
                <select
                  name="spool-type"
                  class="spool-type form-control"
                  selectOnTab
                  v-on:change="changeDataPoint($event)"
                >
                  <option value="requests">Requests</option>
                </select>

                <label class="form-control-label" v-if="dataPoint == 'requests'"
                  >Status:</label
                >
                <select
                  name="spool-work-by"
                  class="spool-type form-control"
                  v-on:change="changeRequestType($event)"
                  v-if="dataPoint == 'requests'"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>

                <label class="form-control-label">Choose Period</label>
                <div style="display: flex; cursor: pointer">
                  <p
                    style="margin-right: 10px; margin-top: 10px"
                    @click="!openDate"
                    @dblclick="!shouldOpenDate"
                  >
                    From:
                  </p>
                  <input
                    v-if="range.start"
                    class="spool-type input form-control"
                    style="width: 40%"
                    :value="range.start.toDateString()"
                    @click="openDate"
                  />
                  <input
                    v-else
                    class="spool-type input form-control"
                    style="width: 40%"
                    :value="range.start"
                    @click="openDate"
                  />
                  <p
                    style="
                      margin-left: 20px;
                      margin-right: 10px;
                      margin-top: 10px;
                    "
                  >
                    To:
                  </p>
                  <input
                    v-if="range.end"
                    @click="openDateTo"
                    class="spool-type input form-control"
                    style="width: 40%"
                    :value="range.end.toDateString()"
                  />
                  <input
                    v-else
                    @click="openDateTo"
                    class="spool-type input form-control"
                    style="width: 40%"
                    :value="range.end"
                  />
                </div>

                <div class="date" v-if="shouldOpenDate">
                  <DatePicker
                    v-model="range.start"
                    @input="setRangeFrom"
                  ></DatePicker>
                </div>
                <div class="date" v-if="shouldOpenDateTo && range.start">
                  <DatePicker
                    v-model="range.end"
                    @input="setRangeTo"
                  ></DatePicker>
                </div>

                <label class="form-control-label">Choose Type</label>
                <select
                  class="spool-type form-control"
                  v-on:change="changeDownloadType($event)"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </form>
              <div class="footer tx-center mg-t-20 form-layout-footer">
                <div
                  v-if="
                    dataPoint === 'requests' &&
                    !salesOrdersLoading &&
                    !tenderProcessesLoading
                  "
                  class="btn btn-primary"
                  @click="download()"
                >
                  <span>DOWNLOAD</span>
                </div>
                <div v-else class="btn btn-primary">
                  <span :disable="true">LOADING...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { orderBy } from "lodash";
import { mapActions } from "vuex";

import { dataSort } from "@/mixins/store";
import iotMixin from "@/mixins/iot/readings";
import timeFunctions from "@/mixins/timeFunctions";

export default {
  components: {
    Calendar,
    DatePicker
  },

  data: () => ({
    dataPoint: "requests",
    salesOrders: [],
    salesOrdersLoading: true,
    tenderProcesses: [],
    tenderProcessesLoading: true,
    bidStatusCodes: [],
    salesOrderStatusCodes: [],
    salesOrdersRangeBy: "created_at",
    tenderProcessesRangeBy: "created_at",
    tenderProcessesRangeFrom: null,
    tenderProcessesRangeTo: null,
    downloadType: "csv",
    showModal: false,
    shouldOpenDate: false,
    shouldOpenDateTo: false,

    salesOrdersRangeFrom: null,
    salesOrdersRangeTo: null,
    range: {
      start: null,
      end: null
    }
  }),
  props: ["authUser"],
  async created() {
    this.getSalesOrders(this);
    this.getTenderProcesses(this);
  },

  computed: {
    purchaseOrdersData() {
      return this.purchaseOrders.length
        ? this.purchaseOrders.map((purchaseOrder) => {
            const purchaseOrderItems = purchaseOrder.items
              ? purchaseOrder.items
              : [];
            let requestName = null;
            let workRequests = null;
            for (let i = 0; i < purchaseOrderItems.length; i++) {
              if (
                purchaseOrder.id === purchaseOrderItems[i].purchase_order_id
              ) {
                const salesOrders =
                  purchaseOrder?.quotation?.tenderProcess?.salesOrders;
                workRequests = salesOrders?.[0]?.workRequests;
                requestName = workRequests?.[0]?.name || "N/A";
                break;
              }
            }
            return {
              "ORDER #": purchaseOrder.code,
              "SERVICE NAME": requestName,
              FACILITY: workRequests ? workRequests[0]?.unit.name : "N/A",
              VENDOR: purchaseOrder.vendor.business_name,
              "TOTAL ORDER": this.money(purchaseOrder.total),
              "CREATED BY": purchaseOrder.createdBy.name,
              "DATE CREATED": new Date(
                purchaseOrder.created_at
              ).toLocaleString(),
              STATUS: purchaseOrder.status.name
            };
          })
        : [
            {
              "ORDER #": "N/A",
              "SERVICE NAME": "N/A",
              FACILITY: "N/A",
              VENDOR: "N/A",
              "TOTAL ORDER": "N/A",
              "CREATED BY": "N/A",
              "DATE CREATED": "N/A",
              STATUS: "N/A"
            }
          ];
    },
    requests() {
      const salesOrders = this.salesOrders;
      const tenderProcesses = this.tenderProcesses;

      const data = dataSort.populateList({
        targetArray: salesOrders,
        newArray: tenderProcesses,
        sortBy: "created_at",
        sortOrder: "desc"
      });

      // if (data.length) {
      //   console.log("order list..", salesOrders);
      //   const orders = [];
      //   for (const order of data) {
      //     const sales_order = order?.salesOrders
      //       ? order.salesOrders?.map((so) => so.code)
      //       : "";

      //     const work_requests = [];

      //     const site_location = [];
      //     const request_createdBy = [];
      //     const workRequest_name = [];

      //     if (order?.salesOrders) {
      //       for (const req of order?.salesOrders) {
      //         // console.log("request..", req?.workRequests)
      //         const wr = req?.workRequests?.map((w) => w.code);

      //         // const st = req?.workRequests[0]?.unit?.map(st => st.name);
      //         // const requestBy = req?.requesters?.map(req => req.name);
      //         // const wk = req?.workRequests?.map(wk => wk.name)

      //         // work_requests.push(...wr)
      //         // site_location.push(...st);
      //         // request_createdBy.push(...requestBy)
      //         // workRequest_name.push(...wk)

      //       }
      //     }

      //     if (order?.workRequests) {
      //       work_requests.push(...order?.workRequests.map((wr) => wr.code));
      //     }
      //     if (order) {
      //       const unitNames = order?.salesOrders.map((orderItem) =>
      //         orderItem.workRequests.map(
      //           (workRequestItem) => workRequestItem
      //         )
      //       );

      //       console.log("unit ", unitNames)

      //     }

      //     const model = {
      //       // "REQUEST #": order.code,
      //       "SalesOrder Code": sales_order
      //         ? sales_order.toString().replaceAll(",", ", ")
      //         : "N/A",
      //       "WorkRequest Code": work_requests.length
      //         ? work_requests.toString().replaceAll(",", ", ")
      //         : "N/A",
      //       // "Site Location": site_location.length
      //       //   ? site_location.toString().replaceAll(",", ", ")
      //       //   : "N/A",
      //       // "Request CreatedBy": request_createdBy.length ? request_createdBy.toString().replaceAll(',', ', ') : 'N/A',
      //       // "WorkRequest Name": workRequest_name.length ? workRequest_name.toString().replaceAll(',', ', ') : 'N/A',
      //       Status: order.status.name,
      //       created_at: new Date(order.created_at).toLocaleString()
      //     };

      //     console.log("first", model);

      //     orders.push(model);
      //   }
      //   return orders;
      // } else {
      //   return [
      //     {
      //       "SalesOrder Code": "N/A",
      //       "WorkRequest Code": "N/A",
      //       "Site Location": "N/A",
      //       "Request CreatedBy": "N/A",
      //       "WorkRequest Name": "N/A",
      //       Status: "N/A",
      //       created_at: "N/A"
      //     }
      //   ];
      // }

      if (data.length) {
        // console.log("order list..", this.salesOrders);
        const orders = [];
        for (const order of this.salesOrders) {

          const work_requests = [];
          const site_location = [];
          const request_createdBy = [];
          const workRequest_name = [];
          const status_name = [];

          if (order?.workRequests) {
            for (const req of order?.workRequests) {
              const unitName = req?.unit.name;
              const statusName = req?.status.name;
              const workRequestName = req?.name;

              const wr = req?.code;

              // console.log("unit ", req)

              // const st = req?.workRequests[0]?.unit?.map(st => st.name);
              const requestBy = order?.requesters?.map(req => req.name);

              work_requests.push(wr);
              site_location.push(unitName);
              status_name.push(statusName);
              request_createdBy.push(...requestBy)
              workRequest_name.push(workRequestName)
            }
          }

          const model = {
            // "REQUEST #": order.code,
            "SalesOrder Code": order ? order?.code : "N/A",
            "WorkRequest Code": work_requests.length
              ? work_requests.toString().replaceAll(",", ", ")
              : "N/A",
            "Site Location": site_location.length
              ? site_location.toString().replaceAll(",", ", ")
              : "N/A",
            "Request CreatedBy": request_createdBy.length ? request_createdBy.toString().replaceAll(',', ', ') : 'N/A',
            "WorkRequest Name": workRequest_name.length ? workRequest_name.toString().replaceAll(',', ', ') : 'N/A',
            "Status": status_name.length
              ? status_name.toString().replaceAll(",", ", ")
              : "N/A",
            "created_at": new Date(order.created_at).toLocaleString()
          };

          // console.log("first", model);

          orders.push(model);
        }
        return orders;
      } else {
        return [
          {
            "SalesOrder Code": "N/A",
            "WorkRequest Code": "N/A",
            "Site Location": "N/A",
            "Request CreatedBy": "N/A",
            "WorkRequest Name": "N/A",
            "Status": "N/A",
            "created_at": "N/A"
          }
        ];
      }
    }
  },
  methods: {
    ...mapActions({
      getSalesOrders: "hagul/inventory/salesOrders/getSalesOrders",
      getTenderProcesses: "hagul/purchase/tenderProcesses/getTenderProcesses"
    }),
    async download() {
      if (this.downloadType === "xlsx") {
        switch (this.dataPoint) {
          case "requests":
            this.xlsxHelper(this.requests, "requests", "Requests Sheet");
            break;
          default:
            break;
        }
      } else if (this.downloadType === "csv") {
        switch (this.dataPoint) {
          case "requests":
            this.downloadCSV(this.requests, "requests");
            break;
          default:
            break;
        }
      }
    },

    changeDownloadType(event) {
      let type = event.target?.value;
      if (type == "csv") {
        this.downloadType = "csv";
      } else if (type == "xlsx") {
        this.downloadType = "xlsx";
      }
    },
    async setRangeFrom() {
      switch (this.dataPoint) {
        case "requests":
          this.salesOrdersRangeFrom = this.range.start;
          this.tenderProcessesRangeFrom = this.range.start;
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");

          this.getSalesOrders(this);
          this.getTenderProcesses(this);
          break;
      }
    },
    async setRangeTo() {
      switch (this.dataPoint) {
        case "requests":
          this.salesOrdersRangeTo = this.range.end;
          this.tenderProcessesRangeTo = this.range.end;

          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");

          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
          this.getSalesOrders(this);
          this.getTenderProcesses(this);
          break;
      }
    },

    openDate() {
      this.shouldOpenDate = !this.shouldOpenDate;
      this.shouldOpenDateTo = false;
    },
    openDateTo() {
      this.shouldOpenDate = false;
      this.shouldOpenDateTo = !this.shouldOpenDateTo;
    },

    openModal() {
      this.showModal = !this.showModal;
    },
    async changeRequestType(event) {
      let type = event.target?.value;

      switch (type) {
        case "pending":
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");

          this.bidStatusCodes = [
            "pending",
            "rfq-sent",
            "quotation-upload-closed"
          ];
          this.salesOrderStatusCodes = ["pending", "in-stock"];
          await this.getSalesOrders(this);
          await this.getTenderProcesses(this);
          break;

        case "approved":
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");

          this.bidStatusCodes = ["approved"];
          this.salesOrderStatusCodes = ["dispatched", "approved"];
          await this.getSalesOrders(this);
          await this.getTenderProcesses(this);

        default:
          if (
            this.bidStatusCodes != null &&
            this.salesOrderStatusCodes != null
          ) {
            this.bidStatusCodes = null;
            this.salesOrderStatusCodes = null;
            await this.getSalesOrders(this);
            await this.getTenderProcesses(this);
          }
          break;
      }
    },
    changeDataPoint(event) {
      let type = event.target?.value;
      switch (type) {
        case "requests":
          this.dataPoint = "requests";
          break;
        default:
          break;
      }
    }
  },
  mounted() {},
  mixins: [iotMixin, timeFunctions]
};
</script>

<style scoped>
.container {
  position: relative;
}

.wrapper {
  background: rgb(19, 148, 81);
  border-radius: 60px;
  width: 61px;
  height: 61px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -webkit-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -moz-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  cursor: pointer;
}

.wrapper:hover::after {
  content: "Download Spool Report";
  width: 100px;
  min-height: 30px;
  background: rgb(233, 233, 233);
  border-radius: 10px;
  position: absolute;
  right: -10px;
  top: -45px;
  padding: 6px;
  color: inherit;
}

.wrapper:active {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}

.spool-download {
  height: 50px;
  width: 50px;
}

.modal-item {
  border-radius: 5px;
  align-items: flex-start;

  background: #fff;
  min-height: 500px;
  width: 400px;
  position: fixed;
  top: 20vh;
  left: 30%;
  padding: 20px;
  /* padding-top: 20px; */
  display: flex;
  flex-direction: column;
}

.header {
  flex: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.header > button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  /* background: rgb(255, 102, 0); */
}

/* button:focus {
  outline: none;
} */
.body {
  /* margin-top: 15px; */
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex: 5;
  height: 100%;
  width: 100%;
  /* padding: 10px; */
}

.date {
  margin-bottom: 15px;
  justify-self: center;
  align-self: center;
}

.spool-type {
  width: inherit;
  height: 40px;
  margin-bottom: 20px;
  font-size: 15px;
  color: inherit;
}

.spool-type:focus {
  outline: none;
}

.footer {
  width: inherit;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  user-select: none;
  cursor: pointer;
  background: green;
  height: 45px;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
  -webkit-box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
  -moz-box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
}

.button:hover {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}

.button:active {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}
</style>
