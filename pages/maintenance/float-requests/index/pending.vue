<template>
  <div>
    <div class="container-lg">
      <div class="row d-flex justify-content-between">
        <input type="text" placeholder="Start typing here to search"
          class="col-5 col-md-3 form-control search mg-y-10 mg-x-30 h-25" v-model="floatRequestSearch" />
      </div>
    </div>
    <!-- :list="filteredList" -->
    <v-paginate class="bg-white" :list="floatRequests" v-if="!floatRequestsLoading" perPage="50">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Request</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="floatRequests in paginate.list" :key="floatRequests.id">
                <td>
                  <nuxt-link :to="
                    `/maintenance/float-requests/details?id=${floatRequests.id}`
                  " class="tx-inverse tx-14 tx-medium d-block" v-text="floatRequests.name"></nuxt-link>
                  <span class="tx-11 d-block" v-text="`Code: ${floatRequests.code}`"></span>
                </td>
                <td>
                  <nuxt-link v-if="floatRequests.unit" :to="`/location/units/details?id=${floatRequests.unit.id}`"
                    class="tx-inverse d-block">
                    {{ floatRequests.unit.name }}
                    <span class="d-block" v-if="floatRequests.unit.parent">({{ floatRequests.unit.parent.name }})</span>
                  </nuxt-link>
                </td>
                <td>
                  <span>{{floatRequests.created_at | dateFormat }}</span>
                </td>
                <td>
                  <span v-text="floatRequests.status.name"></span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <th colspan="4">
                  <h5>No data to display</h5>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import { mapActions } from "vuex";
import moment from "moment";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  components: { loading, vPaginate, DatePicker },
  created() {
    this.setScope(this.$route.query.scope);
    this.statusFilter();
  },
  data: () => ({
    floatRequests: [],
    floatRequestsLoading: true,
    floatRequestStatusCodes: ["pending"],
    floatRequestSearch: null,
    floatItemsLoading: true,
    floatOutputsRangeBy: "updated_at",
    floatOutputsRangeFrom: null,
    floatOutputsRangeTo: null,
  }),
  head: () => ({
    title: "Float Requests · Tsebo-Rapid"
  }),
  meta: {
    pageName: "float-requests.index"
  },
  methods: {
    ...mapActions({
      getFloatRequests: "maintenance/floatRequests/getFloatRequests",

    }),
    setScope(scope) {
      this.floatRequestStatusCodes = this.floatRequestScopeStatuses["pending"];
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getFloatRequests(this);
    },
    async statusFilter() {
      this.floatItemsLoading = true;

      let statusResponse = []
      try {
        const response = await this.$axios("float-requests", {
          params: {
            associations: ["unit", "status"]
          },
        });
        let absolutePending = []
        statusResponse = response.data.data;
        for (let i = 0; i < statusResponse.length; i++) {
          if (statusResponse[i].status.code.toLowerCase() === "pending") {
            absolutePending.push(statusResponse[i])
          }

        }
        this.floatRequests = absolutePending;
        this.floatItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss"),
      };
    },


  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  props: ["floatRequestScopeStatuses"],
  watch: {
    $route(to) {
      this.$store.commit("maintenance/floatRequests/toggleRefresh");
      this.setScope(to.query.scope);
    },
    floatRequestSearch(search) {
      this.debounce(() => {
        this.getFloatRequests(this);
      }, 300);
    }
  }
};
</script>

