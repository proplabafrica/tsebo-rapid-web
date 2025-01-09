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
                    <span style="font-size: 13px">x</span>
                  </button>
                </div>

                <label class="form-control-label">Category: </label>
                <select
                  name="spool-type"
                  class="spool-type form-control"
                  selectOnTab
                  v-on:change="changeDataPoint($event)"
                >
                  <option value="purchase">Purchase Orders</option>
                </select>

                <label class="form-control-label">Status:</label>
                <select
                  name="spool-work-by"
                  class="spool-type form-control"
                  v-on:change="changeStatusType($event)"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="posted">Posted</option>
                  <option value="part-payment">Part Payment</option>
                  <option value="paid">Paid</option>
                  <option value="terminated">Terminated</option>
                </select>

                <label class="form-control-label" v-if="hasUnit"
                  >Facility</label
                >
                <select
                  name="spool-type"
                  class="spool-type form-control"
                  v-on:change="changeUnit($event)"
                  v-if="hasUnit"
                >
                  <option value="all">All</option>
                  <option
                    v-for="unit in units"
                    :key="unit.id"
                    v-text="
                      `${unit.name} ${
                        unit.parent ? ` - ${unit.parent.name}` : ''
                      }`
                    "
                    :value="`${unit.name} - ${unit.id}`"
                  ></option>
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
                <div class="date" v-if="shouldOpenDateTo">
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
                  v-if="dataPoint === 'purchase' && !purchaseOrdersLoading"
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
import iotMixin from "@/mixins/iot/readings";
import timeFunctions from "@/mixins/timeFunctions";

export default {
  components: {
    Calendar,
    DatePicker
  },

  data: () => ({
    purchaseOrdersRangeBy: null,
    purchaseOrdersRangeFrom: null,
    purchaseOrdersRangeTo: null,
    name: "",
    showModal: false,
    canSpoolVendors: false,
    shouldOpenDate: false,
    shouldOpenDateTo: false,
    item: null,
    users: [],
    usersLoading: false,
    tunedPurchaseOrders: [],
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    loading: false,
    range: {
      start: null,
      end: null
    },
    search: "",
    dataPoint: "purchase",
    downloadType: "csv",
    hasUnit: true,
    relatedUnitsSales: [],
    currentUnit: "all",
    unitId: null,
    started: [],
    completed: [],
    byPurchaseOrderStatusCodes: []
  }),
  props: ["authUser", "units", "unitsLoading"],
  async created() {
    this.getPurchaseOrders(this);
    const systemFunctionCodes = this.authUser.roles
      .reduce((functions, role) => functions.concat(role.systemFunctions), [])
      .map((systemFunction) => systemFunction.code);

    this.canSpoolVendors = systemFunctionCodes.includes("vendors.index");
  },

  computed: {
    purchaseOrdersData() {
      if (this.unitId && this.unitId !== "all") {
        this.getPurchaseOrderUnits();
      }

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
                workRequests =
                  salesOrders?.[0]?.workRequests ||
                  this.poWorkRequests(purchaseOrder);
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
              "AMOUNT PAID": this.amountPaid(purchaseOrder),
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
    }
  },
  methods: {
    ...mapActions({
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    amountPaid(purchaseOrder) {
      let amount_paid = 0;
      if (Object.keys(purchaseOrder).length === 0) return 0;
      purchaseOrder.transactions.forEach((transaction) => {
        let balance = transaction.credit - transaction.debit;
        amount_paid += balance;
      });
      return amount_paid;
    },
    poWorkRequests(purchaseOrder) {
      const purchaseOrderItems = purchaseOrder.items ? purchaseOrder.items : [];
      let workRequests = null;
      for (let i = 0; i < purchaseOrderItems.length; i++) {
        if (purchaseOrder.id === purchaseOrderItems[i].purchase_order_id) {
          const salesOrders =
            purchaseOrder?.quotation?.tenderProcess?.salesOrders;
          workRequests = salesOrders?.[0]?.workRequests;
        }
      }
      return workRequests;
    },
    getPurchaseOrderUnits() {
      let purchaseOrderUnits = [];
      for (let i = 0; i < this.purchaseOrders.length; i++) {
        const purchaseOrder = this.purchaseOrders[i];
        let poSalesOrderWorkRequests = this.poWorkRequests(purchaseOrder);
        let poTenderProcessWorkRequests =
          purchaseOrder.quotation.tenderProcess.workRequests;

        if (poSalesOrderWorkRequests && poSalesOrderWorkRequests.length) {
          if (this.unitId === poSalesOrderWorkRequests[0].unit_id) {
            purchaseOrderUnits.push(purchaseOrder);
          }
        }
        if (poTenderProcessWorkRequests && poTenderProcessWorkRequests.length) {
          if (this.unitId === poTenderProcessWorkRequests[0].unit_id) {
            purchaseOrderUnits.push(purchaseOrder);
          }
        }
      }
      this.purchaseOrders = purchaseOrderUnits;
    },
    async download() {
      if (this.downloadType === "xlsx") {
        switch (this.dataPoint) {
          case "purchase":
            this.xlsxHelper(
              this.purchaseOrdersData,
              "purchaseOrders",
              "Purchase Orders Sheet"
            );
            break;
          default:
            break;
        }
      } else if (this.downloadType === "csv") {
        switch (this.dataPoint) {
          case "purchase":
            this.downloadCSV(this.purchaseOrdersData, "purchase-orders");
            break;
          default:
            break;
        }
      }
    },
    shortReadableTime(timeInMilliseconds) {
      return this.secondsToReadableTime(
        timeInMilliseconds / 1000,
        ["minute", "hour", "day", "week", "year"],
        "short"
      );
    },
    secondsToReadableTime(seconds, units, toString = null) {
      units = orderBy(this.getTimeUnitsInSeconds(units), ["value"], ["desc"]);
      const results = [];
      units.forEach((unit) => {
        const unitValue = Math.floor(seconds / unit.value);
        seconds -= unitValue * unit.value;
        if (unitValue > 0) {
          results.push({
            name: unit.name,
            value: unitValue
          });
        }
      });
      if (toString == "long") {
        var text = "";
        results.forEach((result) => {
          text += `${result.value} ${result.name}(s) `;
        });
        return text;
      }
      if (toString == "short") {
        var text = "";
        results.forEach((result) => {
          name = result.name.substring(0, 1);
          text += `${result.value} ${name} `;
        });
        return text;
      }
      return results;
    },
    getTimeUnits(units) {
      const timeUnits = [
        { name: "minute", value: 1 / 60 },
        { name: "hour", value: 1 },
        { name: "day", value: 24 },
        { name: "week", value: 24 * 7 },
        { name: "year", value: 24 * 365.25 }
      ];

      return timeUnits.filter((timeUnit) => {
        return units.includes(timeUnit.name);
      });
    },
    getTimeUnitsInSeconds(units) {
      return this.getTimeUnits(units).map((unit) => {
        unit.value *= 3600;
        return unit;
      });
    },
    changeDownloadType(event) {
      let type = event.target?.value;
      if (type == "csv") {
        this.downloadType = "csv";
      } else if (type == "xlsx") {
        this.downloadType = "xlsx";
      }
    },
    async getUnits() {
      const response = await this.$axios.get("units", {
        params: { associations: ["parent"] }
      });
      this.units = response.data.data;
    },
    async setRangeFrom() {
      switch (this.dataPoint) {
        case "purchase":
          this.purchaseOrdersRangeBy = "created_at";
          this.purchaseOrdersRangeFrom = this.range.start;
          await this.$store.commit(
            "hagul/purchase/purchaseOrders/toggleRefresh"
          );
          await this.getPurchaseOrders(this);

          break;
        default:
          break;
      }
    },
    async setRangeTo() {
      switch (this.dataPoint) {
        case "purchase":
          this.purchaseOrdersRangeTo = this.range.end;
          await this.$store.commit(
            "hagul/purchase/purchaseOrders/toggleRefresh"
          );
          await this.getPurchaseOrders(this);

        default:
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
    async changeUnit(event) {
      let unit = event.target?.value;
      this.unitId = Number(unit.split("-")[1]);
      this.currentUnit = unit.split("-")[0].toLowerCase();
      switch (this.dataPoint) {
        case "purchase":
          await this.$store.commit(
            "hagul/purchase/purchaseOrders/toggleRefresh"
          );
          await this.getPurchaseOrders(this);

          break;
        default:
          break;
      }
    },
    async openModal() {
      this.showModal = !this.showModal;
    },
    async changeStatusType(event) {
      let type = event.target?.value;
      if (type == "all") {
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      } else if (type == "pending") {
        this.byPurchaseOrderStatusCodes = ["PO-CREATED"];
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      } else if (type == "posted") {
        this.byPurchaseOrderStatusCodes = ["PO-POSTED"];
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      } else if (type == "part-payment") {
        this.byPurchaseOrderStatusCodes = ["PO-PART-PAY"];
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      } else if (type == "paid") {
        this.byPurchaseOrderStatusCodes = ["PO-PAID"];
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      } else if (type == "terminated") {
        this.byPurchaseOrderStatusCodes = ["PO-XX"];
        await this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        await this.getPurchaseOrders(this);
      }
    },
    async changeDataPoint(event) {
      let type = event.target?.value;
      switch (type) {
        case "purchase":
          this.dataPoint = "purchase";
          this.hasUnit = true;
          break;
        default:
          break;
      }
    }
  },
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
