<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
      <h6 class="slim-pagetitle">
        Hi,
        <span v-text="authUser.name"></span>
      </h6>
    </div>
    <!-- slim-pageheader -->

    <performance-tabs class="mg-b-10" />
    <hagul-chart />

    <div class="row row-sm mg-t-0">
      <div class="col-xl-6">
        <requests :bidStatusCodes="['pending', 'rfq-sent', 'quotation-upload-closed']"
          :salesOrderStatusCodes="['pending', 'in-stock']" name="PENDING REQUESTS" :axios="$axios" />
      </div>
      <!-- col-6 -->

      <div class="col-xl-6 mg-t-20 mg-xl-t-0">
        <requests :bidStatusCodes="['approved']" :salesOrderStatusCodes="['dispatched', 'approved']"
          name="APPROVED REQUESTS" />
      </div>
      <!-- col-6 -->
    </div>

    <div class="spool-container">
      <spool-report class="price" :authUser="authUser" />
    </div>


    <div class="price-container">
      <price-check class="price" />
    </div>

    <!-- row -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import requests from "@/components/hagul/dashboard/requests";
import hagulChart from "@/components/performance/hagul/hagul-chart";
import performanceTabs from "@/components/performance/hagul/tabs";
import authMixin from "@/mixins/hagul/auth";

export default {

  components: {
    requests,
    performanceTabs,
    hagulChart,
    "status-table": () =>
      import("@/components/maintenance/requests/status-table"),
    "performance-tabs": () => import("@/components/performance/hagul/tabs"),
    "price-check": () => import("@/components/ui/price-check.vue"),
    "spool-report": () => import("@/components/ui/spool-report-hagul.vue")
  },
  head: () => ({
    title: "Dashboard · Hagul"
  }),
  meta: {
    pageName: "sales-orders.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>

<style>
.spool-container {
  position: fixed;
  bottom: 15%;
  left: 2%;
  display: flex;
}

.price-container {
  position: fixed;
  bottom: 15%;
  right: 2%;
  display: flex;
}
</style>
