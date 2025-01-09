<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Purchasing</li>
      </ol>
      <h6 class="slim-pagetitle">Purchasing</h6>
    </div>
    <!-- slim-pageheader -->
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, vPaginate },
  data: () => ({
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    purchaseOrdersPagination: {
      page: 1,
      perPage: 30,
      pages: []
    },
    salesOrders: [],
    salesOrdersLoading: true,
    salesOrdersPagination: {
      page: 1,
      perPage: 30,
      pages: []
    }
  }),
  head: () => ({
    title: "Purchasing · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
