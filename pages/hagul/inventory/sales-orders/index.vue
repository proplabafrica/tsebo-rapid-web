<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Sales Orders</li>
      </ol>
      <h6 class="slim-pagetitle">Sales Orders</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/hagul/inventory/sales-orders"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
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
  meta: {
    pageName: "sales-orders.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
