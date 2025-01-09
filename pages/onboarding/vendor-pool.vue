<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Vendor Pool</li>
      </ol>
      <h6 class="slim-pagetitle">Vendor Pool</h6>
    </div>
    <!-- slim-pageheader -->
    <div class="card pd-10">
      <vendor-pool />
    </div>
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import vendorPool from "@/pages/hagul/vendors/index/pool";

export default {
  components: { vendorPool },
  head: () => ({
    title: "Vendor Pool · Tsebo-Rapid"
  }),
  meta: {
    pageName: "vendors.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
