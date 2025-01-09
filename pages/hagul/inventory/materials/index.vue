<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Materials</li>
      </ol>
      <h6 class="slim-pagetitle">Materials</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/hagul/inventory/materials"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          to="/hagul/inventory/materials/create"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose"></i> Create
        </nuxt-link>
        <nuxt-link
          to="/hagul/inventory/materials/bulk-import"
          class="nav-link"
          active-class="active"
        >
          <i class="icon ion-ios-cloud-upload"></i> Bulk Import
        </nuxt-link>
        <nuxt-link
          to="/hagul/inventory/materials/categories"
          class="nav-link"
          exact-active-class="active"
          >Categories</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <keep-alive>
      <nuxt-child />
    </keep-alive>
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/hagul/auth";

export default {
  head: () => ({
    title: "Materials · Hagul"
  }),
  meta: {
    pageName: "materials.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
