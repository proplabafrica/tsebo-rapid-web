<template>
  <div class="row row-xs">
    <div class="col mg-t-10 mg-lg-t-0" v-show="false">
      <div class="card card-status">
        <div class="media">
          <i class="icon ion-happy-outline tx-teal"></i>
          <div class="media-body">
            <h1
              v-if="
                ratings.length && ratingByParameter('client-satisfaction') > 0
              "
            >
              {{ (ratingByParameter("client-satisfaction") * 100) | twoDP }}%
            </h1>
            <h1 v-else>{{ ratingByParameter("client-satisfaction") }}%</h1>
            <p>Client Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mg-t-10 mg-lg-t-0">
      <div class="card card-status card-height shadow-sm rounded">
        <div class="media">
          <i class="icon ion-ios-list-outline tx-danger"></i>
          <div class="media-body">
    <h1>{{ { value: monthlyCost } | toMoney }}</h1>
    <div
      class="formal-button px-2 p-t-2 p-b-2 pos-relative b-10"
      style="float: right"
      @click="showCalender = !showCalender"
    >
      <i class="ionicons ion-android-menu tx-teal"></i>
    </div>
    <div
      class="formal-button px-2 p-t-2 p-b-2 pos-relative b-10"
      style="float: right"
      @click="clearRange"
    >
      <i class="ionicons ion-refresh tx-teal"></i>
    </div>
    <p style="width: 12rem">Monthly Overall Spending</p>
    <div>
      <p v-if="!salesOrderItemsLoading" style="width: 18.23rem">
        {{ `(` + monthRange + `)` }}
      </p>
      <div class="loader" v-else>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- <div v-else> hello</div> -->
    </div>
    <date-picker
      @update="$emit('update')"
      class="calender"
      :class="{ show: showCalender }"
      v-model="range"
      is-range
      @input="getMonthlyCost"
    />
  </div>
        </div>
      </div>
    </div>
    <div class="col mg-t-10 mg-lg-t-0">
      <div class="card card-status card-height shadow-sm rounded">
        <div class="media">
          <i class="icon ion-ios-medkit-outline tx-teal"></i>
          <div class="media-body">
            <h1
              v-if="
                ratings.length && ratingByParameter('delivery-timeliness') > 0
              "
            >
              {{ (ratingByParameter("delivery-timeliness") * 100) | twoDP }}%
            </h1>
            <h1 v-else>{{ ratingByParameter("delivery-timeliness") }}%</h1>
            <p>Vendor Timelines</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col mg-t-10 mg-lg-t-0">
      <div class="card card-status card-height shadow-sm rounded">
        <div class="media">
          <i class="icon ion-ios-clock-outline tx-warning"></i>
          <div class="media-body">
            <h1>{{ salesOrdersCount + tenderProcessesCount }}</h1>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { get } from "axios";
import { mapActions } from "vuex";
import moment from "moment";

export default {
  components: {
    DatePicker
  },
  created() {
    // this.getClientSatisFaction();
    this.getOpenIncidents();
    this.getRatings(this);
    this.getSalesOrdersCount(this);
    this.getSlaPerformance();
    this.getTenderProcessesCount(this);
    this.getMonthlyCost();
    this.getPurchaseOrders(this);

  },
  data: () => ({
    // monthRange: "",
    // range: {
    //   start: new Date(),
    //   end: new Date(),
    // },
    dateTime: new Date().toString().substring(4, 15),
    bidStatusCodes: ["pending", "rfq-sent", "quotation-upload-closed"],
    clientSatisfaction: null,
    openIncidents: 0,
    parameterCodes: [
      "delivery-timeliness",
      "contract-adherence",
      "client-satisfaction"
    ],
    ratings: [],
    ratingsLoading: true,
    rateableCode: "purchase_orders",
    salesOrderStatusCodes: ["pending"],
    salesOrdersCount: null,
    slaPerformance: null,
    tenderProcessesCount: null,
    // showRange: 0,
    presentDate: new Date(),
    purchaseOrders: [],
    purchaseOrdersLoading: true,

    monthRange: "",
    showCalender: false,
    message: "God is good always",
    monthlyCost: 0,
    salesOrderItems: [],
    salesOrderItemsLoading: true,
    salesOrders: [],
    salesOrdersRangeBy: "updated_at",
    salesOrdersRangeFrom: null,
    salesOrdersRangeTo: null,
    workRequests: [],
    workRequestsLoading: true
  }),
  methods: {
    ...mapActions({
      getRatings: "performance/ratings/getRatings",
      getSalesOrdersCount: "hagul/inventory/salesOrders/getSalesOrdersCount",
      getTenderProcessesCount:
        "hagul/purchase/tenderProcesses/getTenderProcessesCount",
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    async getOpenIncidents() {
      try {
        const response = await get(
          `${process.env.VAMP_FFM_URL}/reports/open-incidents`,
          {
            headers: { Authorization: process.env.VAMP_FFM_SECRET }
          }
        );
        this.openIncidents = response.data.count;
      } catch (error) {
        console.log(error);
      }
    },
    clearRange() {
      this.range = null;
    },
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
    async getMonthlyCost() {
      this.showCalender = false;
      this.salesOrderItemsLoading = true;

      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );

      this.salesOrdersRangeFrom = this.range ? this.range.start : rangeFrom;
      this.salesOrdersRangeTo = this.range ? this.range.end : rangeTo;

      try {
        const response = await this.$axios.get("purchase-orders-for-om", {
          params: {
            associations: ["items", "status", "currency", "createdBy"],
            rangeBy: "created_at",
            rangeFrom: this.salesOrdersRangeFrom,
            rangeTo: this.salesOrdersRangeTo
          }
        });

        this.salesOrderItems = response.data.data;
        this.salesOrderItemsLoading = false;

        var itemCostObject = this.salesOrderItems.map((item) => {
          var itemCost = item.total === null ? 0 : item.total;
          return itemCost;
        });

        this.monthlyCost = itemCostObject.reduce(
          (total, num) => total + num,
          0
        );

        // var itemCostObject = this.salesOrderItems.map((item) => {
        //   var itemCost =
        //     item.materialCost != null
        //       ? item.materialCost.amount != null
        //         ? item.materialCost.amount
        //         : 0
        //       : 0;

        //   return {
        //     quantity: item.quantity,
        //     cost: itemCost,
        //   };
        // });

        this.monthRange = this.range
          ? `${this.range.start.toString().substring(4, 15)} - ${this.range.end
              .toString()
              .substring(4, 15)}`
          : name;

        // this.salesOrderItemsLoading = false;
        // this.monthlyCost = itemCostObject.reduce(
        //   (sum, item) => (sum += item.cost * item.quantity),
        //   0
        // );
      } catch (error) {
        console.log(error);
      }
    },
    async getSlaPerformance() {
      try {
        const response = await get(
          `${process.env.VAMP_FFM_URL}/reports/sla-performance`,
          {
            headers: { Authorization: process.env.VAMP_FFM_SECRET }
          }
        );
        this.slaPerformance = response.data.performance;
      } catch (error) {
        console.log(error);
      }
    },
    ratingByParameter(parameterCode) {
      const ratings = this.ratings.filter(
        (rating) => rating.parameter.code == parameterCode
      );
      const totalScore = ratings.reduce(
        (total, rating) => total + parseFloat(rating.rating),
        0
      );
      const totalAchievable = ratings.reduce(
        (total, rating) => total + parseFloat(rating.max_rating),
        0
      );

      if (
        totalAchievable == 0 ||
        totalScore == 0 ||
        isNaN(totalAchievable) ||
        isNaN(totalScore)
      )
        return 0;
      return totalScore / totalAchievable;
    }
  },
};
</script>

<style scoped>
.calender {
  transition-property: display;
  transition-duration: 1000ms;
  transition-delay: 500ms;
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: absolute;
  left: 125px;
  top: 70px;
  z-index: 300;
  display: none;
}
.show {
  transition-property: display;
  transition-duration: 1s;
  transition-delay: 1s;
  display: block;
}

/* LOADER */
.loader {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 10px;
}

.loader div {
  position: absolute;
  top: 45%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c00000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: 6px;
  animation: loader1 0.6s infinite;
}

.loader div:nth-child(2) {
  left: 6px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(3) {
  left: 20px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(4) {
  left: 40px;
  animation: loader3 0.6s infinite;
}

@keyframes loader1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes loader3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes loader2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(19px, 0);
  }
}
</style>
