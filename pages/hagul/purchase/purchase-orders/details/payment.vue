<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/hagul/purchase/purchase-orders/details/payment?id=${purchaseOrder.id}`"
          class="nav-link"
          exact-active-class="active"
          v-if="purchaseOrder.paymentSchedules.length > 0"
          >Schedule</nuxt-link
        >
        <nuxt-link
          v-if="purchaseOrder.total - amountScheduled > 0"
          :to="`/hagul/purchase/purchase-orders/details/payment/create?id=${purchaseOrder.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose"></i> Create
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :purchaseOrder="purchaseOrder" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  computed: {
    amountDue() {
      const pendingPayments = this.purchaseOrder.paymentSchedules.filter(
        (schedule) => schedule.status.code == "pending"
      );
      var total = 0;
      for (const schedule of pendingPayments) {
        total += schedule.amount;
      }
      return total;
    },
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
