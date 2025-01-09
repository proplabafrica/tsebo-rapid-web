<template>
  <div class="col-12 col-md mg-b-10 mg-md-b-0">
    <div class="container-lg">
      <div class="row row-lg mg-t-10 mg-t-10 d-flex flex-column">
        <div class="float-right mg-b-10">
          <div class="card-header" :style="{ backgroundColor: '#e3e7f2' }">
            <h6 class="slim-card-title">Order Chart</h6>
          </div>
          <div v-if="!(isTotalListLoading && isPendingListLoading)">
            <div>
              <div class="card card-status card-height col col-12">
                <div id="hagul-order"></div>
              </div>
            </div>
          </div>
          <loading v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
// import authMixin from "@/mixins/auth";
import moment from "moment";
import { mapActions } from "vuex";
import slaMixin from "@/mixins/performance/sla";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import ApexCharts from "apexcharts";

export default {
  components: {
    loading,
    vModal
  },
  async created() {
    // this.getDelieveredRequest();
    // await this.getPendingRequest();
    await this.getDelieveredRequest();
  },
  async mounted() {
    await this.getTotalOrders();
    await this.getPendingOrders();
    await this.getTotalOrderList();
    await this.getPurchaseOrders(this);
    await this.getPendingOrderList();
    await this.getPendingRequest();
    this.renderOrderChart();
  },

  data: () => ({
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    statusLoading: true,

    ratingsLoading: true,
    rateableCodes: ["work_requests"],
    workRequestStatusCodes: ["60", "65", "80"],
    salesOrderInput: [],
    pendingOrdersRangeFrom: null,
    pendingOrdersRangeTo: null,
    pendingOrderItems: [],
    pendingOrderStatusCodes: ["pending"],
    firstPendingOrder: [],
    newlyGottenPendingOrder: [],
    formattedPendingOrder: [],
    PendingOrderMade: [],
    monthlyPendingOrder: [],
    pendingOrderItemsLoading: true,
    isPendingListLoading: true,

    totalOrdersRangeFrom: null,
    totalOrdersRangeTo: null,
    totalSalesOrderItems: [],
    totalOrderStatusCodes: ["pending"],
    firstTotalOrder: [],
    newlyGottenTotalOrder: [],
    formattedTotalOrder: [],
    TotalOrderMade: [],
    monthlyTotalOrder: [],
    totalSalesOrderItemsLoading: true,
    isTotalListLoading: true,
    totalPurchaseOrderItemsLoading: true,
    totalPurchaseOrderItems: [],
    formattedTotalOrders: [],
    totalPendingRequest: [],
    delieveredLoading: true,
    formattedDelievered: [],
    totalDelieveredRequest: []
  }),
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests",
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss")
      };
    },
    async getDelieveredRequest() {
      // this.statusLoading = true;
      this.delieveredLoading = true;
      let delieveredVariable = [];
      try {
        const response = await this.$axios.get("purchase-orders", {
          params: {
            associations: ["currency", "status", "items"]
          }
        });
        delieveredVariable = response.data.data;
      } catch (error) {
        console.log(error);
      }

      const delieveredSign = delieveredVariable.filter(
        (order) => order.status.code === "delivered"
      );
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      // const delieveredOrder = this.purchaseOrders.filter(
      //     order => order.status.code === "delivered")
      // "secondly better things >>> ", delieveredOrder)

      let delieveredDate = [];
      for (let i = 0; i < delieveredSign.length; i++) {
        if (delieveredSign[i].created_at) {
          delieveredDate.push(
            delieveredSign[i].created_at.toString().substring(0, 10)
          );
        }
      }

      let rearrangeDelieveredDate = [];
      for (let i = 0; i < delieveredDate.length; i++) {
        if (delieveredDate.length > 0) {
          rearrangeDelieveredDate.push(
            months[delieveredDate[i].split("-")[1] - 1],
            delieveredDate[i].split("-")[2] + "th",
            delieveredDate[i].split("-")[0]
          );
        }
      }
      // let newlyGottenpending = []
      for (let i = 0; i < rearrangeDelieveredDate.length; i++) {
        if (i % 3 === 0) {
          this.formattedDelievered.push(
            rearrangeDelieveredDate[i + 1] +
              " " +
              rearrangeDelieveredDate[i] +
              " " +
              rearrangeDelieveredDate[i + 2]
          );
        }
        this.formattedDelievered;
      }
      // "baddest boy<<<<", rearrangeDelieveredDate)

      const currentDate = new Date();
      let delieveredAll = [];
      // "object>>>", currentDate.getMonth() + 1);

      if (currentDate.getMonth() + 1 <= 13) {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            delieveredAll.push({
              month: i + 13,
              year: currentDate.getFullYear() - 1
            });
          } else {
            delieveredAll.push({
              month: i + 1,
              year: currentDate.getFullYear()
            });
          }
        }
      } else {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            delieveredAll.push({
              month: i + 13,
              year: currentDate.getFullYear() - 1
            });
          } else {
            delieveredAll.push({
              month: i + 1,
              year: currentDate.getFullYear()
            });
          }
        }
      }

      const delieveredTheDate = [];

      for (var i = 0; i < delieveredAll.length; i++) {
        delieveredTheDate.push({
          ...delieveredAll[i],
          month: months[delieveredAll[i].month - 1]
        });
      }

      const filteredDelieveredCurrent = delieveredTheDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear())
      );

      const filteredDelieveredB4 = delieveredTheDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear() - 1)
      );
      // "first access >>>", delieveredTheDate)
      // "there is a way that seems right", this.formattedDelievered)

      let filteredDelieveredCurrentCount = [];
      for (var i = 0; i < this.formattedDelievered.length; i++) {
        for (var j = 0; j < filteredDelieveredCurrent.length; j++) {
          if (
            this.formattedDelievered[i].split(" ")[2] ==
              currentDate.getFullYear() &&
            this.formattedDelievered[i]
              .toString()
              .includes(filteredDelieveredCurrent[j].month)
          ) {
            filteredDelieveredCurrentCount.push(
              filteredDelieveredCurrent[j].month
            );
          }
        }
      }

      // "majesty>>>>>>", filteredDelieveredCurrentCount);

      let filteredDelieveredCurrentBefore = [];
      for (var i = 0; i < this.formattedDelievered.length; i++) {
        for (var j = 0; j < filteredDelieveredB4.length; j++) {
          if (
            this.formattedDelievered[i].split(" ")[2] ==
              currentDate.getFullYear() - 1 &&
            this.formattedDelievered[i]
              .toString()
              .includes(filteredDelieveredB4[j].month)
          ) {
            filteredDelieveredCurrentBefore.push(filteredDelieveredB4[j].month);
          }
        }
      }
      // "matter don cast>>>>>", filteredDelieveredCurrentBefore);

      let delieveredCount = new Array(months.length).fill(0);
      // itemArrayCount)

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredDelieveredCurrentCount.length; j++) {
          if (filteredDelieveredCurrentCount[j].includes(months[i])) {
            delieveredCount[i]++;
          }
        }
      }

      let delieveredB4 = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredDelieveredCurrentBefore.length; j++) {
          if (filteredDelieveredCurrentBefore[j].includes(months[i])) {
            delieveredB4[i]++;
          }
        }
      }

      let delieverdArray = [];
      delieverdArray = delieveredCount;
      let convertArray = delieveredB4.slice(9, 12).reverse();
      for (let i = 0; i < convertArray.length; i++) {
        if (convertArray.length > 0) {
          delieverdArray.unshift(convertArray[i]);
        }
      }
      this.totalDelieveredRequest = delieverdArray.slice(0, 9);
      // "mane is a beast>...",delieveredB4)
      // "salah is a good Winger>>>>", delieveredCount)

      // let pattern = []
      // for (var i = 0; i < delieveredB4.length; i++) {
      //     if(delieveredB4[i] > 0) {
      //         pattern.push(delieveredB4[i])
      //     }
      // }
      // "rema >>>>>>", pattern)

      // const currentYear = delieveredCount.filter(req => req > 0)
      // const previousYear = delieveredB4.filter(req => req > 0 || delieveredB4.length === 0);
      // currentYear.reverse();
      // "current years to find the coming to the world....", currentYear)
      // "previous years to find the taking....", previousYear)

      // let patternArray = []
      // for(let i = 0; i < currentYear.length; i++){
      //     if(currentYear.length > 0){
      //         patternArray.push(previousYear[i])
      //        previousYear.push(currentYear[i])
      //     }
      // }
      // this.totalDelieveredRequest = previousYear
      // "object",  this.totalDelieveredRequest);
      // "objecting mighty>>", previousYear);

      // "holding on to the last Thing<<>>>", currentYear);
      this.delieveredLoading = false;
    },
    async getPendingOrders() {
      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );
      this.pendingOrdersRangeFrom = rangeFrom;
      this.pendingOrdersRangeTo = rangeTo;

      try {
        const response = await this.$axios("sales-orders", {
          params: {
            associations: ["status", "workRequests.status"],
            rangeBy: "updated_at",
            rangeFrom: this.pendingOrdersRangeFrom,
            rangeTo: this.pendingOrdersRangeTo,
            statusCodes: this.pendingOrderStatusCodes
          }
        });
        this.pendingOrderItems = response.data.data;
        this.pendingOrderItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getPendingOrderList() {
      this.isPendingListLoading = true;
      await this.getPendingOrders();
      let initialPendingList = [];

      for (let pendingList of this.pendingOrderItems) {
        if (this.pendingOrderItems.length > 0) {
          initialPendingList.push(pendingList.created_at.slice(0, 10));
        }
      }
      // "PURCHASELIST++++++++++++++", initialPendingList);

      this.firstPendingOrder = initialPendingList;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      for (let i = 0; i < this.firstPendingOrder.length; i++) {
        if (this.firstPendingOrder.length > 0) {
          this.newlyGottenPendingOrder.push(
            months[this.firstPendingOrder[i].split("-")[1] - 1],
            this.firstPendingOrder[i].split("-")[2] + "th",
            this.firstPendingOrder[i].split("-")[0]
          );
        }
      }
      // "newlyGottenPendingOrder++++++++++++++", this.newlyGottenPendingOrder);
      for (let i = 0; i < this.newlyGottenPendingOrder.length; i++) {
        if (i % 3 === 0) {
          this.formattedPendingOrder.push(
            this.newlyGottenPendingOrder[i + 1] +
              " " +
              this.newlyGottenPendingOrder[i] +
              " " +
              this.newlyGottenPendingOrder[i + 2]
          );
        }
        this.formattedPendingOrder;
      }
      // "formattedPendingOrder++++++++++++++",this.formattedPendingOrder);

      const currentDate = new Date();
      let all = [];

      if (currentDate.getMonth() + 1 <= 13) {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      } else {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      }
      // all)

      let theDate = [];

      for (var i = 0; i < all.length; i++) {
        theDate.push({ ...all[i], month: months[all[i].month - 1] });
      }
      // "date++++++++++++++", theDate);

      const filteredCurrent = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear())
      );
      // filteredCurrent);

      const filteredB4 = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear() - 1)
      );
      // filteredB4);

      let filteredCurrentCount = [];
      for (var i = 0; i < this.formattedPendingOrder.length; i++) {
        for (var j = 0; j < filteredCurrent.length; j++) {
          if (
            this.formattedPendingOrder[i].split(" ")[2] ==
              currentDate.getFullYear() &&
            this.formattedPendingOrder[i]
              .toString()
              .includes(filteredCurrent[j].month)
          ) {
            filteredCurrentCount.push(filteredCurrent[j].month);
          }
        }
      }

      // filteredCurrentCount);

      let filteredCurrentBefore = [];
      for (var i = 0; i < this.formattedPendingOrder.length; i++) {
        for (var j = 0; j < filteredB4.length; j++) {
          if (
            this.formattedPendingOrder[i].split(" ")[2] ==
              currentDate.getFullYear() - 1 &&
            this.formattedPendingOrder[i]
              .toString()
              .includes(filteredB4[j].month)
          ) {
            filteredCurrentBefore.push(filteredB4[j].month);
          }
        }
      }
      // filteredCurrentBefore);

      let itemArrayCount = new Array(months.length).fill(0);
      // itemArrayCount)

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentCount.length; j++) {
          if (filteredCurrentCount[j].includes(months[i])) {
            itemArrayCount[i]++;
          }
        }
      }

      let itemArrayB4 = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentBefore.length; j++) {
          if (filteredCurrentBefore[j].includes(months[i])) {
            itemArrayB4[i]++;
          }
        }
      }
      // "PendingOrder++++++++++++++", itemArrayB4)
      // "Pending++++++++++++++", itemArrayCount)

      let patternBefore = [];
      for (var i = 0; i < itemArrayB4.length; i++) {
        if (itemArrayB4[i]) {
          patternBefore.push(itemArrayB4[i]);
        }
      }
      // patternBefore)

      let sliceArrayBefore = [];
      if (itemArrayB4) {
        sliceArrayBefore = itemArrayB4.slice(9, 12);
      }

      let patternCurrent = [];
      for (var i = 0; i < itemArrayCount.length; i++) {
        if (itemArrayB4[i]) {
          patternCurrent.push(itemArrayCount[i]);
        }
      }

      let sliceArrayCurrent = [];
      if (itemArrayCount) {
        sliceArrayCurrent = itemArrayCount.slice(0, 3);
        sliceArrayCurrent.reverse();
        this.PendingOrderMade = sliceArrayBefore;
      }
      // "arraylifeCurrent.......",  sliceArrayCurrent);
      // "pending order.....", this.PendingOrderMade);

      for (let i = 0; i < sliceArrayCurrent.length; i++) {
        if (sliceArrayCurrent.length > 0) {
          this.PendingOrderMade.push(sliceArrayCurrent[i]);
        }
      }

      // "first........", this.PendingOrderMade)

      let dateArray = [];
      for (let i = 0; i < theDate.length; i++) {
        if (theDate.length > 0) {
          dateArray.push(theDate[i].month.slice(0, 3) + " " + theDate[i].year);
        }
      }
      if (!this.monthlyPendingOrder.length) {
        this.monthlyPendingOrder = dateArray.slice(0, 9).reverse();
      }

      this.isPendingListLoading = false;
      // "this.monthlySalesReport_______________", this.monthlySalesReport)
      // "this.this.PendingOrderMade_______________", this.PendingOrderMade);
    },
    async getTotalOrders() {
      // "... sales orders")
      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );
      this.totalOrdersRangeFrom = rangeFrom;
      this.totalOrdersRangeTo = rangeTo;

      try {
        const response = await this.$axios("sales-orders", {
          params: {
            associations: ["status", "type", "workRequests.status"],
            rangeBy: "updated_at",
            rangeFrom: this.totalOrdersRangeFrom,
            rangeTo: this.totalOrdersRangeTo
          }
        });
        this.totalSalesOrderItems = response.data.data;
        // response.data.data, "sales orders");
        this.totalSalesOrderItemsLoading = false;
        // "sales orders saved", this.totalSalesOrderItems)
      } catch (error) {
        console.log(error);
      }

      try {
        const response = await this.$axios("purchase-orders");
        this.totalPurchaseOrderItemsLoading = false;
        this.totalPurchaseOrderItems = response.data.data;
        // "this.totalPurchaseOrderItems+++++++++++++++++", this.totalPurchaseOrderItems)
      } catch (error) {
        console.log(error.message);
      }

      for (let i = 0; i < this.totalPurchaseOrderItems.length; i++) {
        if (this.totalPurchaseOrderItems.length > 0) {
          this.totalSalesOrderItems.push(this.totalPurchaseOrderItems[i]);
        }
      }
      // "this.totalPurchaseOrderItems+++++++++++++++++", this.totalSalesOrderItems)
    },
    async getTotalOrderList() {
      this.isTotalListLoading = true;
      await this.getTotalOrders();
      let initialTotalList = [];
      for (let totalList of this.totalSalesOrderItems) {
        if (this.totalSalesOrderItems.length > 0) {
          initialTotalList.push(totalList.created_at.slice(0, 10));
        }
      }
      // initialSalesList);

      this.firstTotalOrder = initialTotalList;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      for (let i = 0; i < this.firstTotalOrder.length; i++) {
        if (this.firstTotalOrder.length > 0) {
          this.newlyGottenTotalOrder.push(
            months[this.firstTotalOrder[i].split("-")[1] - 1],
            this.firstTotalOrder[i].split("-")[2] + "th",
            this.firstTotalOrder[i].split("-")[0]
          );
        }
        this.formattedTotalOrder;
      }
      for (let i = 1; i < this.newlyGottenTotalOrder.length; i++) {
        if (i % 3 === 0) {
          this.formattedTotalOrder.push(
            this.newlyGottenTotalOrder[i + 1] +
              " " +
              this.newlyGottenTotalOrder[i] +
              " " +
              this.newlyGottenTotalOrder[i + 2]
          );
        }
        this.formattedTotalOrder;
      }
      // "this.formattedTotalOrder =========", this.formattedTotalOrder);

      const currentDate = new Date();
      let all = [];

      if (currentDate.getMonth() + 1 <= 13) {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      } else {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      }
      // all);

      let theDate = [];

      for (var i = 0; i < all.length; i++) {
        theDate.push({ ...all[i], month: months[all[i].month - 1] });
      }

      const filteredCurrent = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear())
      );

      const filteredB4 = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear() - 1)
      );

      let filteredCurrentCount = [];
      for (var i = 0; i < this.formattedTotalOrder.length; i++) {
        for (var j = 0; j < filteredCurrent.length; j++) {
          if (
            this.formattedTotalOrder[i].split(" ")[2] ==
              currentDate.getFullYear() &&
            this.formattedTotalOrder[i]
              .toString()
              .includes(filteredCurrent[j].month)
          ) {
            filteredCurrentCount.push(filteredCurrent[j].month);
          }
        }
      }

      // filteredCurrentCount.length);

      let filteredCurrentBefore = [];
      for (var i = 0; i < this.formattedTotalOrder.length; i++) {
        for (var j = 0; j < filteredB4.length; j++) {
          if (
            this.formattedTotalOrder[i].split(" ")[2] ==
              currentDate.getFullYear() - 1 &&
            this.formattedTotalOrder[i].toString().includes(filteredB4[j].month)
          ) {
            filteredCurrentBefore.push(filteredB4[j].month);
          }
        }
      }
      // filteredCurrentBefore.length);

      let itemArrayCount = new Array(months.length).fill(0);
      // itemArrayCount)

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentCount.length; j++) {
          if (filteredCurrentCount[j].includes(months[i])) {
            itemArrayCount[i]++;
          }
        }
      }

      let itemArrayB4 = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentBefore.length; j++) {
          if (filteredCurrentBefore[j].includes(months[i])) {
            itemArrayB4[i]++;
          }
        }
      }
      // itemArrayB4)
      // itemArrayCount)

      let pattern = [];
      for (var i = 0; i < itemArrayB4.length; i++) {
        if (itemArrayB4[i] > 0) {
          pattern.push(itemArrayB4[i]);
        }
      }

      const currentYear = itemArrayCount.filter((req) => req > 0);
      const previousYear = itemArrayB4.filter(
        (req) => req > 0 || itemArrayB4.length === 0
      );
      currentYear.reverse();
      // "current years to find the coming to the world....", currentYear)
      // "previous years to find the taking....", previousYear)
      // "to find the taking....", previousYear.slice(2, 5))

      // previousYear.length)

      for (let i = 0; i <= previousYear.length; i++) {
        let patternArray = [];
        if (previousYear.length > 0) {
          patternArray = previousYear.slice(2, 5);
          currentYear.push(patternArray[i]);
          this.TotalOrderMade.push(currentYear[i]);
        }
      }

      // for(var i =0; i<currentYear.length; i++){
      //     this.TotalOrderMade.push(currentYear[i])
      // }
      // "this.TotalOrderMade_______________", this.TotalOrderMade)

      this.isTotalListLoading = false;
    },
    async getPendingRequest() {
      this.statusLoading = true;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      const pendingOrder = this.purchaseOrders.filter(
        (order) => order.status.code
      );

      let pendingDate = [];
      for (let i = 0; i < pendingOrder.length; i++) {
        if (pendingOrder[i].created_at) {
          pendingDate.push(
            pendingOrder[i].created_at.toString().substring(0, 10)
          );
        }
      }
      // "first>>>>> jealous", pendingDate)

      let rearrangePendingDate = [];
      for (let i = 0; i < pendingDate.length; i++) {
        if (pendingDate.length > 0) {
          rearrangePendingDate.push(
            months[pendingDate[i].split("-")[1] - 1],
            pendingDate[i].split("-")[2] + "th",
            pendingDate[i].split("-")[0]
          );
        }
      }
      // let newlyGottenpending = []
      for (let i = 0; i < rearrangePendingDate.length; i++) {
        if (i % 3 === 0) {
          this.formattedTotalOrders.push(
            rearrangePendingDate[i + 1] +
              " " +
              rearrangePendingDate[i] +
              " " +
              rearrangePendingDate[i + 2]
          );
        }
        this.formattedTotalOrders;
      }
      // "baddest boy<<<<", rearrangePendingDate)

      const currentDate = new Date();
      let pendingAll = [];
      // "object>>>", currentDate.getMonth() + 1);

      if (currentDate.getMonth() + 1 <= 13) {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            pendingAll.push({
              month: i + 13,
              year: currentDate.getFullYear() - 1
            });
          } else {
            pendingAll.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      } else {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            pendingAll.push({
              month: i + 13,
              year: currentDate.getFullYear() - 1
            });
          } else {
            pendingAll.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      }

      const pendingAllDate = [];

      for (var i = 0; i < pendingAll.length; i++) {
        pendingAllDate.push({
          ...pendingAll[i],
          month: months[pendingAll[i].month - 1]
        });
      }

      const filteredPendingCurrent = pendingAllDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear())
      );

      const filteredPendingB4 = pendingAllDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear() - 1)
      );
      // "first access >>>", pendingAllDate)
      // "there is a way that seems right", this.formattedTotalOrders)

      let filteredPendingCurrentCount = [];
      for (var i = 0; i < this.formattedTotalOrders.length; i++) {
        for (var j = 0; j < filteredPendingCurrent.length; j++) {
          if (
            this.formattedTotalOrders[i].split(" ")[2] ==
              currentDate.getFullYear() &&
            this.formattedTotalOrders[i]
              .toString()
              .includes(filteredPendingCurrent[j].month)
          ) {
            filteredPendingCurrentCount.push(filteredPendingCurrent[j].month);
          }
        }
      }

      // "majesty>>>>>>", filteredPendingCurrentCount);

      let filteredPendingCurrentBefore = [];
      for (var i = 0; i < this.formattedTotalOrders.length; i++) {
        for (var j = 0; j < filteredPendingB4.length; j++) {
          if (
            this.formattedTotalOrders[i].split(" ")[2] ==
              currentDate.getFullYear() - 1 &&
            this.formattedTotalOrders[i]
              .toString()
              .includes(filteredPendingB4[j].month)
          ) {
            filteredPendingCurrentBefore.push(filteredPendingB4[j].month);
          }
        }
      }
      // "matter don cast>>>>>", filteredPendingCurrentBefore);

      let pendingCount = new Array(months.length).fill(0);
      // delieveredCount)

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredPendingCurrentCount.length; j++) {
          if (filteredPendingCurrentCount[j].includes(months[i])) {
            pendingCount[i]++;
          }
        }
      }

      let pendingB4 = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredPendingCurrentBefore.length; j++) {
          if (filteredPendingCurrentBefore[j].includes(months[i])) {
            pendingB4[i]++;
          }
        }
      }
      // "mane is a beast>...",pendingB4)
      // "salah is a good Winger>>>>", pendingCount)

      let pendingArray = [];
      pendingArray = pendingCount;
      let convertArray = pendingB4.slice(9, 12).reverse();
      for (let i = 0; i < convertArray.length; i++) {
        if (convertArray.length > 0) {
          pendingArray.unshift(convertArray[i]);
        }
      }
      // await this.getDelieveredRequest();
      this.totalPendingRequest = pendingArray.slice(0, 9);

      // let pattern = []
      // for (var i = 0; i < delieveredB4.length; i++) {
      //     if(delieveredB4[i] > 0) {
      //         pattern.push(delieveredB4[i])
      //     }
      // }
      // "rema >>>>>>", pattern)

      // const currentYear = delieveredCount.filter(req => req > 0)
      // const previousYear = delieveredB4.filter(req => req > 0 || delieveredB4.length === 0);
      // currentYear.reverse();
      // "current years to find the coming to the world....", currentYear)
      // "previous years to find the taking....", previousYear)

      // let patternArray = []
      // for(let i = 0; i < currentYear.length; i++){
      //     if(currentYear.length > 0){
      //         patternArray.push(previousYear[i])
      //        previousYear.push(currentYear[i])
      //     }
      // }
      // this.totalPendingRequest = previousYear
      // "object",  this.totalPendingRequest);
      // "objecting mighty>>", previousYear);

      // "holding on to the last Thing<<>>>", currentYear);
    },

    async renderOrderChart() {
      var orderChartOptions = {
        chart: {
          id: "hagul-order",
          height: 360,
          type: "area",
          width: "100%",
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#727376", "#c00000"],
        series: [
          {
            name: "Total Purchase Order",
            data: this.totalPendingRequest
            //  data: this.totalDelieveredRequest,
            // data: [0, 0, 0, 0, 0, 2, 2, 0],
            // data:[5, 7, 23, 12, 10, 1, 9, 19]
          },
          {
            name: "Delievered Order",
            data: this.totalDelieveredRequest
            // data:[0, 0, 0, 0, 0, 2, 2, 0],
            // data: this.PendingOrderMade,
          }
        ],
        stroke: {
          width: [3, 3],
          height: 400
        },
        plotOptions: {
          bar: {
            columnWidth: "40%"
          }
        },
        xaxis: {
          categories: this.monthlyPendingOrder
        },
        yaxis: [
          {
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
              color: "#727376"
            },
            labels: {
              style: {
                colors: "#727376"
              }
            },
            title: {
              text: "Total Purchase Order",
              style: {
                color: "#727376"
              }
            }
          },
          {
            opposite: true,
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
              color: "#c00000"
            },
            labels: {
              style: {
                colors: "#c00000"
              }
            },
            title: {
              text: "Delievered Order",
              style: {
                color: "#c00000"
              }
            }
          }
        ],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.0,
            opacityTo: 0.0,
            stops: [0, 60, 100]
          }
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 60
        }
      };
      var renderChartOptions = new ApexCharts(
        document.querySelector("#hagul-order"),
        orderChartOptions
      );
      await renderChartOptions.render();
    }
  },
  middleware: ["auth"],
  mixins: [slaMixin, modalMixin]
};
</script>

<style scoped>
</style>
