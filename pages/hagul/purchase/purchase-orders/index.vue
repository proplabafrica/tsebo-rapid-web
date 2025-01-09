<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase">Purchasing</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Purchase Orders
        </li>
      </ol>
      <h6 class="slim-pagetitle">Purchase Orders</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="container">
      <div class="row">
        <input
          type="text"
          placeholder="Start typing here to search"
          class="form-control wd-250 mg-t-5 mg-b-10 float-left"
          v-model="poSearch"
        />
      </div>
    </div>
    <div class="row mb-10" style="justify-content: space-between">
      <div class="col-md-3">
        <select
          class="form-control mg-t-5 mg-b-10 tx-capitalize"
          style="width: 100%"
          v-on:change="chooseType($event)"
        >
          <option disabled>Select Purchase order Type</option>
          <option value="all" selected>All</option>
          <option value="wr">Purchase Orders from w-request</option>
          <option value="tp">Purchase Orders from T-process</option>
        </select>
      </div>
      <div class="col-md-3" style="position: relative">
        <select
          class="form-control mg-t-5 mg-b-10 tx-capitalize"
          style="width: 100%"
          @click="shouldOpenDate = !shouldOpenDate"
        >
          <option v-if="range.start !== null">
            {{ toReadableDate(range.start) }}
            -
            {{ toReadableDate(range.end) }}
          </option>
          <option v-if="range.start == null">Choose Date</option>
        </select>
        <div
          class="date"
          v-if="shouldOpenDate"
          style="position: absolute; top: 50px"
        >
          <DatePicker v-model="range" is-range></DatePicker>
        </div>
      </div>
      <div class="col-md-3" v-if="selectedType == 'wr'">
        <select
          class="form-control wd-250 mg-t-5 mg-b-10 tx-capitalize"
          style="width: 100%"
          v-on:change="chooseUnit($event)"
        >
          <option>Choose Site</option>
          <option value="0" selected>All</option>
          <option
            v-for="unit in units"
            :key="unit.id"
            v-text="unit.name"
            :value="unit.id"
          ></option>
        </select>
      </div>
      <div class="col-md-3">
        <button
          class="btn btn-primary bd-0 mg-t-5 mg-b-10"
          style="text-transform: uppercase; width: 100%"
          @click="download()"
        >
          Download
        </button>
      </div>
    </div>

    <select
      class="form-control wd-200 mg-t-5 mg-b-10 tx-capitalize float-right"
      v-model="deliveryScope"
    >
      <option v-for="(statuses, scope) in deliveryStatuses" :key="scope">
        {{ scope }}
      </option>
    </select>

    <v-paginate
      class="bg-white"
      :list="spooledRequests"
      :perPage="perPage"
      v-if="!purchaseOrdersLoading"
    >
      <template v-slot="paginate">
        <div class="table-responsive" id="p-orders">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5">Order #</th>
                <th class="pd-y-5" width="30%">Info</th>
                <th class="pd-y-5">Vendor</th>
                <th class="pd-y-5">Created By</th>
                <th class="pd-y-5">Created At</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr
                v-for="purchaseOrder in paginate.list"
                :key="purchaseOrder.id"
              >
                <td>
                  <nuxt-link
                    :to="`/hagul/purchase/purchase-orders/details?id=${purchaseOrder.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="purchaseOrder.code"
                  ></nuxt-link>
                  <span>{{ { value: purchaseOrder.total } | toMoney }}</span>
                </td>
                <td>
                  <span class="d-block">
                    <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                      >Tender Process:</span
                    >
                    <nuxt-link
                      class="tx-inverse"
                      :to="`/hagul/purchase/tender-processes/details?id=${purchaseOrder.quotation.tenderProcess.id}`"
                    >
                      #{{ purchaseOrder.quotation.tenderProcess.code }}
                    </nuxt-link>
                  </span>
                  <span
                    v-for="(salesOrder, index) in purchaseOrder.quotation
                      .tenderProcess.salesOrders"
                    :key="salesOrder.id"
                  >
                    <span class="d-block">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Sales Order:</span
                      >
                      <nuxt-link
                        class="tx-inverse"
                        :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`"
                      >
                        #{{ salesOrder.code }}
                        {{
                          purchaseOrder.quotation.tenderProcess.salesOrders
                            .length >
                          index + 1
                            ? ", "
                            : ""
                        }}
                      </nuxt-link>
                    </span>
                    <span
                      class="d-block"
                      v-if="salesOrder.workRequests.length > 0"
                    >
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Work Request:</span
                      >
                      <nuxt-link
                        class="tx-inverse"
                        v-for="(workRequest, index) in salesOrder.workRequests"
                        :key="workRequest.id"
                        :to="`/maintenance/requests/details?id=${workRequest.id}`"
                      >
                        {{ workRequest.name
                        }}{{
                          index + 1 >= salesOrder.workRequests.length
                            ? ""
                            : ", "
                        }}
                      </nuxt-link>
                    </span>
                  </span>
                </td>
                <td class="tx-14">
                  <nuxt-link
                    class="d-block tx-inverse"
                    v-text="purchaseOrder.vendor.business_name"
                    :to="`/hagul/vendors/details?id=${purchaseOrder.vendor.id}`"
                  ></nuxt-link>
                </td>
                <td class="tx-14">
                  <nuxt-link
                    class="d-block tx-inverse"
                    v-text="purchaseOrder.createdBy.name"
                    :to="`/people/users/details?id=${purchaseOrder.createdBy.id}`"
                  ></nuxt-link>
                  <span
                    class="tx-11 d-block"
                    v-for="role in purchaseOrder.createdBy.roles"
                    :key="role.id"
                    v-text="role.name"
                  ></span>
                </td>
                <td>
                  <span>{{ purchaseOrder.created_at | dateFormat }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="12">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <!-- table-responsive -->
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
      <!-- card-footer -->
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";
import * as XLSX from "xlsx";
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  components: { loading, vPaginate, Calendar, DatePicker },
  created() {
    this.setScope("all");
    this.getUnits();
  },
  mounted() {
    this.setInitialDateRange();

    this.spoolRequest();
  },
  data: () => ({
    poSearch: null,
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    shouldOpenDate: false,
    deliveryScope: "all",
    poStatusCodes: [],
    units: [],
    selectedUnit: "0",
    selectedType: "all",
    perPage: 30,
    dates: [
      {
        date: new Date()
      }
    ],
    range: {
      start: null,
      end: null
    },
    deliveryStatuses: {
      all: ["pending", "delivered", "rejected", "rated"],
      pending: ["pending"],
      delivered: ["delivered"],
      rejected: ["rejected"],
      rated: ["rated"]
    },
    spooledRequests: [],
    status: "all"
  }),
  head: () => ({
    title: "Purchase Orders · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.index"
  },
  methods: {
    ...mapActions({
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    setScope(scope) {
      this.poStatusCodes = this.deliveryStatuses[scope];
      this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      this.getPurchaseOrders(this);
    },
    download() {
      if (this.spooledRequests.length > 0) {
        let createXLSLFormatObj = [];
        let date = Date.parse(new Date());
        let ws_name = `purchase-orders-${date} `;
        let filename = `${date}-purchase-order.xlsx`;
        let downloadable = [];
        for (let i = 0; i < this.spooledRequests.length; i++) {
          let purchase = {
            DATE: "",
            ORDER: "",
            "SALES ORDER": "",
            "WORK REQUEST": "",
            "WORK TITLE": "",
            "WORK STATUS": "",
            PRICE: "",
            VENDOR: "",
            STATUS: "",
            "DELIVERY DATE": ""
          };

          purchase.DATE = this.spooledRequests[i].created_at.split(" ")[0];

          purchase.ORDER = `${this.spooledRequests[i].code}`;
          purchase["SALES ORDER"] =
            this.spooledRequests[i].quotation.tenderProcess.salesOrders.length >
            0
              ? `#${this.spooledRequests[i].quotation.tenderProcess.salesOrders[0].code}`
              : ``;
          purchase["WORK REQUEST"] =
            this.spooledRequests[i].quotation.tenderProcess.salesOrders.length >
            0
              ? `#${this.spooledRequests[i].quotation.tenderProcess.salesOrders[0].workRequests[0].code}`
              : "";
          purchase["WORK TITLE"] =
            this.spooledRequests[i].quotation.tenderProcess.salesOrders.length >
            0
              ? `${this.spooledRequests[i].quotation.tenderProcess.salesOrders[0].workRequests[0].name}`
              : "";
          purchase["WORK STATUS"] =
            this.spooledRequests[i].quotation.tenderProcess.salesOrders.length >
            0
            ? `${this.spooledRequests[i].quotation.tenderProcess.salesOrders[0].workRequests[0].status.name}`
            : "";
          purchase.PRICE = this.spooledRequests[i].total;
          purchase.VENDOR = this.spooledRequests[i].vendor.business_name;
          purchase.STATUS = this.spooledRequests[i].status.name;
          if (this.spooledRequests[i].logs.length > 0) {
            let log = this.spooledRequests[i].logs.filter(
              (log) => log.delivery_status_id == 2
            );
            if (log.length > 0) {
              purchase["DELIVERY DATE"] = log[0].created_at;
            }
          }

          downloadable.push(purchase);
        }

        let xlsHeader = [
          "DATE",
          "ORDER ID",
          "SALES ORDER ID",
          "WORK REQUEST ID",
          "WORK REQUEST TITLE",
          "WORK REQUEST STATUS",
          "COST",
          "VENDOR",

          "STATUS",
          "DELIVERY DATE"
        ];
        createXLSLFormatObj.push(xlsHeader);
        $.each(downloadable, function (index, value) {
          var innerRowData = [];
          $("tbody").append(
            "<tr><td>" +
              value["DATE"] +
              "</td><td>" +
              value["ORDER"] +
              "</td><td>" +
              value["SALES ORDER"] +
              "</td><td>" +
              value["WORK REQUEST"] +
              "</td><td>" +
              value["WORK TITLE"] +
              "</td><td>" +
              value["WORK STATUS"] +
              "</td><td>" +
              value["VENDOR"] +
              "</td><td>" +
              value["PRICE"] +
              "</td><td>" +
              value["STATUS"] +
              "</td><td>" +
              value["DELIVERY DATE"] +
              "</td></tr>"
          );
          $.each(value, function (ind, val) {
            innerRowData.push(val);
          });
          createXLSLFormatObj.push(innerRowData);
        });

        if (createXLSLFormatObj.length > 0) {
          var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

          XLSX.utils.book_append_sheet(wb, ws, ws_name);

          XLSX.writeFile(wb, filename);
          location.reload();
        }
      }
    },
    chooseUnit(event) {
      let type = event.target?.value;
      this.selectedUnit = type;
    },
    setInitialDateRange() {
      if (this.purchaseOrders[0]) {
        let lastPO = this.purchaseOrders[0].created_at;

        let firstPO =
          this.purchaseOrders[this.purchaseOrders.length - 1].created_at;

        this.range.start = new Date(firstPO).toUTCString();
        this.range.end = new Date(lastPO).toUTCString();
      }
    },
    chooseType(event) {
      let type = event.target?.value;
      this.selectedType = type;
    },
    toReadableDate(date) {
      if (date) {
        let thedate = new Date(date).toUTCString();

        let day = thedate.split(" ")[1];

        let month = thedate.split(" ")[2];

        let year = thedate.split(" ")[3];

        if (day && month && year) return day + " " + month + " " + year;
      }
    },
    spoolByDate(spooledRequests) {
      if (this.range.start != null && this.range.end != null) {
        if (this.range.start != null && this.range.end != null) {
          let sr = spooledRequests.filter(
            (p) =>
              Date.parse(p.created_at) >= Date.parse(this.range.start) &&
              Date.parse(p.created_at) <= Date.parse(this.range.end)
          );

          return sr;
        } else {
          return [];
        }
      }
    },
    spoolByUnit(spooledRequests) {
      if (this.selectedUnit == 0) {
        return spooledRequests;
      } else {
        let sr = spooledRequests.filter(
          (p) =>
            p.quotation &&
            p.quotation.tenderProcess &&
            p.quotation.tenderProcess.salesOrders[0] &&
            p.quotation.tenderProcess.salesOrders[0].workRequests[0].unit_id ==
              this.selectedUnit
        );

        return sr;
      }
    },
    spoolRequest() {
      if (this.purchaseOrders.length > 0) {
        if (this.selectedType == "all") {
          let po = this.purchaseOrders;
          this.spooledRequests = po;
          if (this.range.start != null && this.range.end != null) {
            this.spooledRequests = this.spoolByDate(this.spooledRequests);
          }
          this.spooledRequests = this.spoolByUnit(this.spooledRequests);
        } else if (this.selectedType == "wr") {
          let sr = this.purchaseOrders.filter(
            (p) =>
              p.quotation &&
              p.quotation.tenderProcess &&
              p.quotation.tenderProcess.salesOrders[0] &&
              p.quotation.tenderProcess.salesOrders[0].workRequests[0].unit_id
          );

          this.spooledRequests = sr;
          if (this.range.start != null && this.range.end != null) {
            this.spooledRequests = this.spoolByDate(this.spooledRequests);
          }
          this.spooledRequests = this.spoolByUnit(this.spooledRequests);

          // this.spoolByDate(this.spooledRequests));
        }
      }
    },
    async getUnits() {
      const response = await this.$axios.get("units_procure");

      this.units = response.data.data;
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    deliveryScope(scope) {
      this.setScope(scope);
    },
    purchaseOrders() {
      this.debounce(() => {
        this.spoolRequest(), this.setInitialDateRange();
      }, 300);
    },
    selectedType() {
      this.debounce(() => this.spoolRequest(), 300);
    },
    selectedUnit() {
      this.debounce(() => this.spoolRequest(), 300);
    },

    range() {
      this.debounce(() => {
        this.spoolRequest();
      }, 300);
    },
    poSearch() {
      this.debounce(() => this.getPurchaseOrders(this), 300);
    }
  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
button:focus {
  outline: none;
}

.bg-white {
  --bg-opacity: 1;
  background-color: #fff;
  background-color: rgba(255, 255, 255, var(--bg-opacity));
}
</style>
