<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/hagul/purchase/tender-processes/details/bidding?id=${tenderProcess.id}`"
          class="nav-link"
          exact-active-class="active"
          >Quotations</nuxt-link
        >
        <nuxt-link
          v-if="false"
          :to="`/hagul/purchase/tender-processes/details/bidding/rfqs?id=${tenderProcess.id}`"
          class="nav-link"
          exact-active-class="active"
          >RFQs</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <keep-alive>
      <nuxt-child :tenderProcess="tenderProcess" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  props: ["tenderProcess"]
};
</script>
