<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Asset Registry</li>
      </ol>
      <h6 class="slim-pagetitle">Asset Registry</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link to="/assets" class="nav-link" exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/assets/equipment-categories"
          class="nav-link"
          exact-active-class="active"
          >Categories</nuxt-link
        >
        <nuxt-link
          to="/assets/equipment-brands"
          class="nav-link"
          exact-active-class="active"
          >Brands</nuxt-link
        >
        <nuxt-link
          to="/assets/equipment-capacities"
          class="nav-link"
          exact-active-class="active"
          >Specifications</nuxt-link
        >
        <nuxt-link
          to="/assets/bulk-import"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-ios-cloud-upload"></i> Bulk Import
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/auth";
export default {
  meta: {
    pageName: "assets.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
