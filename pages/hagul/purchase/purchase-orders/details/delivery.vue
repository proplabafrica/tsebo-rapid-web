<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/hagul/purchase/purchase-orders/details?id=${purchaseOrder.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose"></i> Create
        </nuxt-link>
        <nuxt-link
          :to="`/hagul/purchase/purchase-orders/details/delivery/log?id=${purchaseOrder.id}`"
          class="nav-link"
          exact-active-class="active"
          >Log</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :purchaseOrder="purchaseOrder" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  computed: {
    isFullyDelivered() {
      var isFullyDelivered = true;
      for (const item of this.purchaseOrder.items) {
        if (item.delivered_at == null) {
          isFullyDelivered = false;
        }
      }
      return isFullyDelivered;
    }
  },
  props: ["purchaseOrder"]
};
</script>
