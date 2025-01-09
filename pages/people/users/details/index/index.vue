<template>
  <v-paginate class="bg-white" :list="clientRequests" perPage="30" v-if="!clientRequestsLoading">
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-responsiv">
          <thead>
            <tr>
              <td width="43%">Request</td>
              <td>Unit</td>
              <td width="25%">Status</td>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="request in paginate.list" :key="request.id">
              <td>
                <nuxt-link :to="`/maintenance/requests/approval?id=${request.id}`" class="tx-inverse">
                  <span v-text="request.name" class="tx-bold d-block"></span>
                  <span class="tx-11" v-text="`Code: ${request.code}`"></span>
                </nuxt-link>
              </td>
              <td>
                <nuxt-link class="tx-inverse tx-14 tx-medium d-block"
                  :to="`/location/units/details?id=${request.unit.id}`" v-text="request.unit.name"></nuxt-link>
              </td>
              <td>
                <span v-text="request.status.name"></span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">
                <h5>No data to display</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
  </v-paginate>
  <!-- v-paginate -->
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getClientRequests();
  },
  data: () => ({
    clientRequests: [],
    clientRequestsLoading: true
  }),
  head: () => ({
    title: "User Requests · Tsebo-Rapid"
  }),
  meta: {
    pageName: "people.users.details.index"
  },
  methods: {
    async getClientRequests() {
      var {
        associations,
        pagination
      } = this.$store.state.maintenance.clientRequests;
      const { page, perPage } = pagination;
      const created_by = this.user.id;

      try {
        this.clientRequests = (
          await this.$axios.get("client-requests", {
            params: { associations, created_by, page, perPage }
          })
        ).data.data;
        this.clientRequestsLoading = false;
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  },
  mixins: [authMixin],
  props: ["user"]
};
</script>
