<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Quotations</li>
      </ol>
      <h6 class="slim-pagetitle">Quotations</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm mg-t-0">
      <div class="col-12">
        <v-paginate :list="quotations" perPage="30" v-if="!quotationsLoading">
          <template v-slot="paginate">
            <div class="table-responsive">
              <quotations-list :quotations="paginate.list" />
            </div>
          </template>
          <!-- table-responsive -->
          <template
            v-slot:linksWrapper
            class="card-footer tx-13 pd-y-15 bg-transparent"
          ></template>
          <!-- card-footer -->
        </v-paginate>
        <loading v-else />
      </div>
      <!-- col-12 -->
    </div>
    <!-- row -->
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import quotationsList from "@/components/hagul/purchase/quotations/list";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, quotationsList, vPaginate },
  created() {
    this.getQuotations();
  },
  data: () => ({
    quotations: [],
    quotationsLoading: true
  }),
  head: () => ({
    title: "Quotations · Hagul"
  }),
  meta: {
    pageName: "quotations.index"
  },
  methods: {
    async getQuotations() {
      var {
        associations,
        quotations,
        pagination,
        refresh
      } = this.$store.state.hagul.purchase.quotations;
      const { page, perPage } = pagination;

      if (refresh == false) {
        this.quotationsLoading = false;
        return (this.quotations = quotations);
      }

      try {
        const response = await this.$axios.get("quotations", {
          params: {
            associations,
            page,
            perPage,
            sortBy: "created_at",
            sortOrder: "desc"
          }
        });
        this.$store.commit(
          "hagul/purchase/quotations/setQuotations",
          response.data.data
        );
        this.$store.commit(
          "hagul/purchase/tenderProcesses/setPagination",
          response.data
        );
        this.quotations = this.$store.state.hagul.purchase.quotations.quotations;
        this.quotationsLoading = false;
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
