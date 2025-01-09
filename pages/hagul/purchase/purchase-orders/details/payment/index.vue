<template>
  <div class="table-responsive mg-t-10">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(schedule, index) in purchaseOrder.paymentSchedules"
          :key="schedule.id"
        >
          <td>
            <span v-text="index + 1"></span>
          </td>
          <td>
            <span
              class="tx-14 tx-medium"
              v-html="
                purchaseOrder.currency.unicode +
                $options.filters.moneyFormat(parseFloat(schedule.amount))
              "
            ></span>
          </td>
          <td>
            <span>{{ schedule.due_date | dateFormat }}</span>
          </td>
          <td>
            <span v-text="schedule.status.name"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    amountScheduled() {
      var total = 0;
      for (const schedule of this.purchaseOrder.paymentSchedules) {
        total += schedule.amount;
      }
      return total;
    }
  },
  props: ["purchaseOrder"]
};
</script>
