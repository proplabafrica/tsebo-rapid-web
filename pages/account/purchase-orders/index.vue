<template>
  <div class="slim-mainpanel">
    <div class="container">
      <div class="slim-pageheader">
        <ol class="breadcrumb slim-breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li aria-current="page" class="breadcrumb-item active">
            Purchase Orders
          </li>
        </ol>
        <h6 class="slim-pagetitle">
          Account |
          <span v-text="'Purchase Orders'"></span>
        </h6>
      </div>
      <div class="nav-statistics-wrapper">
        <nav class="nav">
          <nuxt-link
            to="/account/purchase-orders"
            class="nav-link"
            exact-active-class="active"
            >all</nuxt-link
          >
          <nuxt-link
            v-for="scope in scopes"
            class="nav-link"
            exact-active-class="active"
            :to="`/account/purchase-orders/by-scope?scope=${scope}`"
            :key="scope"
            >{{ scope }}</nuxt-link
          >
        </nav>
      </div>
      <div class="section-wrapper mg-b-20">
        <nuxt-child :units="units" :unitsLoading="unitsLoading" />
      </div>
    </div>
    <div class="spool-container">
      <account-spool-report
        class="price"
        :authUser="authUser"
        :units="units"
        :unitsLoading="unitsLoading"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import authMixin from "@/mixins/account/auth";

export default {
  components: {
    "account-spool-report": () =>
      import("@/components/ui/account-spool-report.vue")
  },
  head: () => ({
    title: "Dashboard · Account"
  }),
  meta: {
    pageName: "purchase-orders.index"
  },
  data: () => ({
    units: [],
    unitsLoading: false,
    scopes: ["pending", "posted", "part-payments", "paid", "terminated"]
  }),
  created() {
    this.getUnits(this);
  },
  methods: {
    ...mapActions({
      getUnits: "location/units/getUnits"
    })
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
