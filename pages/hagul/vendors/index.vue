<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Vendors</li>
      </ol>
      <h6 class="slim-pagetitle">Vendors</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/hagul/vendors"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/hagul/vendors/create"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-compose"></i> Register Vendor
        </nuxt-link>
        <nuxt-link
          to="/hagul/vendors/bulk-import"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-ios-cloud-upload"></i> Bulk Import
        </nuxt-link>
        <nuxt-link
          to="/hagul/vendors/pool"
          class="nav-link"
          active-class="active"
        >
          Vendor Pool
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
</template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  meta: {
    pageName: "vendors.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
