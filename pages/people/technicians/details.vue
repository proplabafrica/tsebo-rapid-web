<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/people/technicians">Technicians</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Technician Details
        </li>
      </ol>
      <h6 class="slim-pagetitle">Technician Details</h6>
    </div>
    <!-- slim-pageheader -->
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  head: () => ({
    title: "Technician Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "technicians.show"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
