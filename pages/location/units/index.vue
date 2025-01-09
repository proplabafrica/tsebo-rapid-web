<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Units</li>
      </ol>
      <h6 class="slim-pagetitle">Units</h6>
    </div>
    <!-- slim-pageheader -->
    <units-list />
  </div>
</template>

<script>
import unitsList from "@/pages/location/units/index/index";
import authMixin from "@/mixins/auth";

export default {
  components: { unitsList },
  meta: {
    pageName: "units.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
