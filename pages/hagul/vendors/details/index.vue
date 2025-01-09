<template>
  <div class="table-responsive" v-if="!quotationsLoading">
    <quotations-list :quotations="quotations" />
  </div>
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import quotationsList from "@/components/hagul/purchase/quotations/list";

export default {
  components: { loading, quotationsList },
  created() {
    this.getQuotations();
  },
  data: () => ({
    quotations: [],
    quotationsLoading: true
  }),
  head: () => ({
    title: "Quotations · Vendor · Hagul"
  }),
  meta: {
    pageName: "hagul.vendors.details.quotations"
  },
  methods: {
    async getQuotations() {
      var { pagination } = this.$store.state.hagul.purchase.quotations;
      const { page, perPage } = pagination;
      const byVendorId = this.vendor.id;

      try {
        this.quotations = (
          await this.$axios.get("quotations", {
            params: {
              associations: [
                "createdBy",
                "currency",
                "files",
                "purchaseOrders",
                "status"
              ],
              byVendorId,
              page,
              perPage
            }
          })
        ).data.data;
        this.quotationsLoading = false;
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  },
  props: ["vendor"]
};
</script>
