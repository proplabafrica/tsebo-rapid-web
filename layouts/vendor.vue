<template>
  <hagul-layout>
    <div class="slim-navbar">
      <div class="container">
        <ul class="nav">
          <nuxt-link
            tag="li"
            active-class="active"
            class="nav-item"
            to="/hagul/purchase/rfqs"
          >
            <a class="nav-link">
              <i class="icon ion-ios-briefcase-outline"></i>
              <span>Quotation Requests</span>
            </a>
          </nuxt-link>
          <nuxt-link
            tag="li"
            to="/hagul/purchase/quotations"
            active-class="active"
            class="nav-item"
          >
            <a class="nav-link">
              <i class="icon ion-ios-list-outline"></i>
              <span>Quotations</span>
            </a>
          </nuxt-link>
          <nuxt-link
            tag="li"
            to="/hagul/purchase/purchase-orders"
            active-class="active"
            class="nav-item"
          >
            <a class="nav-link">
              <i class="icon ion-ios-pricetags-outline"></i>
              <span>Purchase Orders</span>
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
export default {
  components: {
    "hagul-layout": () => import("@/components/layouts/hagul")
  },
  head: () => ({
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "https://filmorealty.com/favicon.ico"
      }
    ]
  })
};
</script>
