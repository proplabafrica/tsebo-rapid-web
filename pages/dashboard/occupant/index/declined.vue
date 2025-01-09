<template>
  <v-paginate :list="clientRequests" perPage="30" v-if="!clientRequestsLoading">
    <template v-slot="paginate">
      <div class="table-responsive bg-white">
        <table class="table table-responsiv">
          <thead>
            <tr>
              <th>Request</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="request in paginate.list" :key="request.id">
              <td>
                <nuxt-link
                  :to="`/maintenance/requests/approval?id=${request.id}`"
                  class="tx-inverse"
                >
                  <span v-text="request.name" class="tx-bold d-block"></span>
                </nuxt-link>
                <span
                  class="d-block tx-11"
                  v-text="`Code: ${request.code}`"
                ></span>
              </td>
              <td>
                <nuxt-link
                  v-if="request.unit"
                  :to="
                    linkCheck(
                      'units.show',
                      `/location/units/details?id=${request.unit.id}`
                    )
                  "
                  class="tx-inverse d-block"
                  >{{ request.unit.name }}</nuxt-link
                >
                <span class="tx-11 d-block" v-if="request.unit.parent"
                  >({{ request.unit.parent.name }})</span
                >
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
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
  <!-- v-paginate -->
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.$store.commit("maintenance/clientRequests/toggleRefresh");
    this.getClientRequests(this);
  },
  data: () => ({
    clientRequests: [],
    clientRequestsLoading: true,
    clientRequestStatusCodes: ["rejected"]
  }),
  methods: {
    ...mapActions({
      getClientRequests: "maintenance/clientRequests/getClientRequests"
    })
  },
  mixins: [authMixin]
};
</script>
