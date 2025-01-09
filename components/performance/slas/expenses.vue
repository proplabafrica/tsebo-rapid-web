<template>
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
    <p style="width: 18.23rem">{{ `(` + monthRange + `)` }}</p>
    <date-picker
      @update="$emit('update')"
      class="calender"
      :class="{ show: showCalender }"
      v-model="range"
      is-range
      @input="getMonthlyCost"
    />
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import loading from "@/components/ui/loading";
import { mapActions } from "vuex";

export default {
  components: {
    loading,
    DatePicker,
  },
  computed: {},
  created() {
    this.getMonthlyCost();
    this.setMonths();
  },
  data: () => ({
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
    workRequestsLoading: true,
  }),
  methods: {
    ...mapActions({
      getSalesOrders: "hagul/inventory/salesOrders/getSalesOrders",
    }),
    clearRange() {
      this.range = null;
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
        const response = await this.$axios("sales-order-items", {
          params: {
            associations: ["materialCost"],
            rangeBy: "updated_at",
            rangeFrom: this.salesOrdersRangeFrom,
            rangeTo: this.salesOrdersRangeTo,
          },
        });

        this.salesOrderItems = response.data.data;
        this.salesOrderItemsLoading = false;

        var itemCostObject = this.salesOrderItems.map((item) => {
          var itemCost =
            item.materialCost != null
              ? item.materialCost.amount != null
                ? item.materialCost.amount
                : 0
              : 0;

          return {
            quantity: item.quantity,
            cost: itemCost,
          };
        });

        this.monthRange = this.range
          ? `${this.range.start.toString().substring(4, 15)} - ${this.range.end
              .toString()
              .substring(4, 15)}`
          : name;

        this.monthlyCost = itemCostObject.reduce(
          (sum, item) => (sum += item.cost * item.quantity),
          0
        );
      } catch (error) {
        console.log(error);
      }
    },
    async setMonths() {
      var currentDate = new Date();
      for (var index = 0; index < 2; index++) {
        const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
          currentDate
        );

        this.$store.commit("maintenance/workRequests/toggleRefresh");
        // clock in 5 days to previous month
        currentDate = new Date(rangeFrom);
        currentDate.setDate(currentDate.getDate() - 5);
      }
      this.reportLoading = false;
    },
  },
  props: ["monthStartAndEnd", "range"],
};
</script>

<style scoped>
.calender {
  transition-property: display;
  transition-duration: 1000ms;
  transition-delay: 500ms;
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: absolute;
  left: 25px;
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
</style>
