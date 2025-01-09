<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Quotation Requests
        </li>
      </ol>
      <h6 class="slim-pagetitle">Quotation Requests</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm mg-t-0">
      <div class="col-12">
        <v-paginate :list="rfqs" perPage="30" v-if="!rfqsLoading">
          <template v-slot="paginate">
            <div class="table-responsive">
              <table class="table table-striped mg-b-0">
                <thead>
                  <tr class="tx-10">
                    <th class="pd-y-5">Tender Process #</th>
                    <th class="pd-y-5">Created At</th>
                    <th class="pd-y-5">Status</th>
                    <th class="pd-y-5">Action</th>
                  </tr>
                </thead>
                <tbody v-if="paginate.list.length > 0">
                  <tr v-for="rfq in paginate.list" :key="rfq.id">
                    <td>
                      <span
                        class="tx-inverse tx-medium d-block"
                        v-text="rfq.tenderProcess.code"
                      ></span>
                      <span
                        class="tx-inverse tx-12 d-block"
                        v-text="rfq.tenderProcess.status.name"
                      ></span>
                    </td>
                    <td>
                      <span class="tx-inverse d-block">{{
                        rfq.created_at | dateFormat
                      }}</span>
                    </td>
                    <td class="tx-inverse">
                      <span v-if="rfq.response_submitted_at"
                        >Response Submitted:
                        {{ rfq.response_submitted_at | dateFormat }}</span
                      >
                      <span v-else>Awaiting Submission</span>
                    </td>
                    <td>
                      <nuxt-link
                        v-if="
                          rfq.response_submitted_at == null &&
                          rfq.tenderProcess.status.code == 'rfq-sent'
                        "
                        :to="`/hagul/purchase/rfqs/upload-quotation?id=${rfq.id}`"
                        class="btn btn-sm btn-primary"
                      >
                        <i class="icon ion-ios-cloud-upload-outline"></i> Upload
                        Quotation
                      </nuxt-link>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="12">
                      <h5>No data to display</h5>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getRfqs();
  },
  data: () => ({
    rfqs: [],
    rfqsLoading: true
  }),
  head: () => ({
    title: "Quotation Requests · Hagul"
  }),
  meta: {
    pageName: "rfqs.index"
  },
  methods: {
    async getRfqs() {
      var { associations, pagination, rfqs, refresh } =
        this.$store.state.hagul.purchase.rfqs;
      const { page, perPage } = pagination;

      if (refresh == false) {
        this.rfqsLoading = false;
        return (this.rfqs = rfqs);
      }

      try {
        const response = await this.$axios.get("rfqs", {
          params: { associations, page, perPage }
        });
        this.$store.commit("hagul/purchase/rfqs/setRfqs", response.data.data);
        this.$store.commit("hagul/purchase/rfqs/setPagination", response.data);
        this.rfqs = this.$store.state.hagul.purchase.rfqs.rfqs;
        this.rfqsLoading = false;
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
