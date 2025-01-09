<template>
  <invoices-list :invoiceScopeStatuses="invoiceScopeStatuses" />
</template>

<script>
import invoicesList from "@/pages/finance/invoices/index/index";
export default {
  data: () => ({
    invoiceScopeStatuses: {
      all: ["negotiating", "approved"],
      pending: ["negotiating"],
      approved: ["approved"]
    }
  }),
  components: { invoicesList }
};
</script>
