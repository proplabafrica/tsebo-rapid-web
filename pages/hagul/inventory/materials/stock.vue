<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Low materials stock</li>
      </ol>
      <h6 class="slim-pagetitle">Low Materials Stock</h6>
    </div>
    <!-- slim-pageheader -->

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
    title: "Materials Stock · Hagul"
  }),
  meta: {
    pageName: "materials.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
