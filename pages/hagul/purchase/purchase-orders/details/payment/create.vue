<template>
  <form id="create-schedules-form" class="mg-t-20">
    <h6 class="tx-center" :class="{ 'tx-danger': this.amountScheduled > this.purchaseOrder.total }">
      Amount Due
      <span v-html="
        purchaseOrder.currency.unicode +
        $options.filters.moneyFormat(
          parseFloat(purchaseOrder.total - amountScheduled)
        )
      "></span>
      <small class="tx-block tx-bold tx-danger" v-if="validationErrors.amount_max"
        v-text="validationErrors.amount_max"></small>
    </h6>
    <div class="row" v-for="(schedule, index) in schedules" :key="`schedule-${index}`">
      <div class="col-sm-6 form-group">
        <label class="form-control-label">
          Amount
          <span class="tx-danger">*</span>
          <span v-html="
            purchaseOrder.currency.unicode +
            $options.filters.moneyFormat(parseFloat(schedule.amount))
          "></span>
        </label>
        <input type="number" class="form-control" step="any" :name="`amount${index}`" v-model="schedule.amount"
          placeholder="Amount" required />
        <small class="tx-bold tx-danger" v-if="validationErrors[`amount${index}`]"
          v-text="validationErrors[`amount${index}`]"></small>
      </div>

      <div class="col-sm-6">
        <label class="form-control-label">
          Due Date
          <span class="tx-danger">*</span>
        </label>
        <input class="form-control" type="date" required :name="`due_date${index}`" :min="dateToday"
          v-model="schedule.due_date" />
        <small class="tx-bold tx-danger" v-if="validationErrors[`due_date${index}`]"
          v-text="validationErrors[`due_date${index}`]"></small>
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Schedule()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span @click="deleteSchedule(index)" v-if="schedules.length > 1"
          class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>
    </div>
    <div class="tx-center mg-t-20" v-if="this.amountScheduled <= this.purchaseOrder.total">
      <v-button class="btn btn-primary" :disabled="disabled" @click="submitSchedules()">SUBMIT</v-button>
    </div>
  </form>
</template>

<script>
import vButton from "@/components/ui/v-button";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  schedules: [],
  validationErrors: {
    amount_max: ""
  }
});

export default {
  components: { vButton },
  computed: {
    amountScheduled() {
      var total = 0;
      for (const schedule of this.purchaseOrder.paymentSchedules) {
        total += schedule.amount;
      }

      for (const schedule of this.schedules) {
        total += parseFloat(schedule.amount) || 0;
      }
      return total;
    }
  },
  created() {
    this.add1Schedule();
  },
  data: () => getInitialData(),
  methods: {
    add1Schedule() {
      this.schedules.push({
        amount: "",
        due_date: ""
      });
    },
    deleteSchedule(index) {
      this.schedules.splice(index, 1);
    },
    submitSchedules() {
      if (!this.validateForm("create-schedules-form")) return false;
      if (this.amountScheduled > this.purchaseOrder.total) return false;

      this.disabled = true;
      const purchase_order_id = this.purchaseOrder.id;
      const amount = this.schedules.map((schedule) => schedule.amount);
      const due_date = this.schedules.map((schedule) => schedule.due_date);

      this.$axios
        .post("purchase-orders/payment-schedules/store-many", {
          purchase_order_id,
          amount,
          due_date
        })
        .then((response) => {
          this.disabled = false;
          this.$store.commit("finance/paymentSchedules/toggleRefresh");
          this.$emit("update");
          if (this.amountScheduled <= this.purchaseOrder.total) {
            Object.assign(this.$data, getInitialData());
            this.add1Schedule();
          } else {
            this.$router.push("/hagul/purchase/purchase-orders/payment");
          }
        })
        .catch((error) => {
          this.disabled = false;
          const response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {}
        });
    }
  },
  mixins: [formMixin],
  props: ["purchaseOrder"]
};
</script>
