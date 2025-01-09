<template>
  <hagul-layout>
    <div class="slim-navbar">
      <div class="container">
        <ul class="nav">
          <nuxt-link
            tag="li"
            exact-active-class="active"
            class="nav-item"
            to="/hagul"
          >
            <a class="nav-link">
              <i class="icon ion-ios-briefcase-outline"></i>
              <span>Dashboard</span>
            </a>
          </nuxt-link>
          <nuxt-link
            tag="li"
            to="/hagul/inventory"
            active-class="active"
            class="nav-item with-sub"
          >
            <a class="nav-link" data-toggle="dropdown">
              <i class="icon ion-ios-list-outline"></i>
              <span>Inventory</span>
            </a>
            <div class="sub-item">
              <ul>
                <li>
                  <nuxt-link to="/hagul/inventory/sales-orders"
                    >Sales Orders</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link to="/hagul/inventory/materials"
                    >Materials</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link to="/hagul/inventory/services">Services</nuxt-link>
                </li>
              </ul>
            </div>
            <!-- dropdown-menu -->
          </nuxt-link>
          <nuxt-link
            tag="li"
            to="/hagul/purchase"
            active-class="active"
            class="nav-item with-sub"
          >
            <a class="nav-link" data-toggle="dropdown">
              <i class="icon ion-ios-pricetags-outline"></i>
              <span>Procurement</span>
            </a>
            <div class="sub-item">
              <ul>
                <li>
                  <nuxt-link to="/hagul/purchase/purchase-orders"
                    >Purchase Orders</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link to="/hagul/purchase/quotations"
                    >Quotations</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link to="/hagul/purchase/rfqs">RFQs</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/hagul/purchase/tender-processes"
                    >Tender Processes</nuxt-link
                  >
                </li>
                <li v-if="authUser.roles[0].code == 'PM' ||authUser.roles[0].code == 'SYS'">
                  <nuxt-link to="/onboarding/organizations"
                    >Manage
                    </nuxt-link
                  >
                </li>
              </ul>
            </div>
            <!-- dropdown-menu -->
          </nuxt-link>
          <nuxt-link
            tag="li"
            active-class="active"
            to="/hagul/vendors"
            class="nav-item"
          >
            <a class="nav-link">
              <i class="icon ion-ios-people-outline"></i>
              <span>Vendors</span>
            </a>
          </nuxt-link>
        </ul>
      </div>
      <!-- container -->
    </div>
    <!-- slim-navbar -->
    <div class="slim-mainpanel">
      <nuxt />
    </div>
  </hagul-layout>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  components: {
    "hagul-layout": () => import("@/components/layouts/hagul")
  },
   mixins: [authMixin]
}
</script>
