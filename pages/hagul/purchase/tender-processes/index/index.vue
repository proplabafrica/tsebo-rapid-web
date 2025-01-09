<template>
  <div>
    <div class="mg-y-5">
      <input
        type="text"
        placeholder="Start typing here to search"
        class="form-control search mg-b-10 float-left"
        v-model="bidSearch"
      />
      <select
        class="form-control wd-200 mg-t-5 mg-b-10 float-right tx-capitalize"
        v-model="statusScope"
      >
        <option v-for="(statuses, scope) in tenderProcessStatuses" :key="scope">
          {{ scope }}
        </option>
      </select>
    </div>
    <v-paginate
      :list="tenderProcesses"
      perPage="30"
      v-if="!tenderProcessesLoading"
    >
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Tender #</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr
                v-for="tenderProcess in paginate.list"
                :key="tenderProcess.id"
              >
                <td>
                  <nuxt-link
                    :to="`/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="tenderProcess.code"
                  ></nuxt-link>
                  <span class="d-block" v-text="tenderProcess.name"></span>
                  <span class="d-block" v-text="tenderProcess.salesOrders[0]?.workRequests[0]?.name"></span>
                </td>
                <td class="tx-14">
                  <nuxt-link
                    class="d-block tx-inverse"
                    v-text="tenderProcess.createdBy.name"
                    :to="`/people/users/details?id=${tenderProcess.createdBy.id}`"
                  ></nuxt-link>
                  <span
                    class="tx-11 d-block"
                    v-for="role in tenderProcess.createdBy.roles"
                    :key="role.id"
                    v-text="role.name"
                  ></span>
                </td>
                <td>
                  <span class="tx-14">{{
                    tenderProcess.created_at | dateFormat
                  }}</span>
                </td>
                <td>
                  <span
                    class="tx-14 d-block"
                    v-text="tenderProcess.status.name"
                  ></span>
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
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";
import { mapActions } from "vuex";

export default {
  components: { loading, vPaginate },
  created() {
    this.setScope("all");
  },
  data: () => ({
    bidSearch: null,
    statusScope: "all",
    tenderProcesses: [],
    bidStatusCodes: null,
    tenderProcessStatuses: {
      all: [
        "pending",
        "rfq-sent",
        "quotation-upload-closed",
        "vendors-selected",
        "approved",
        "terminated",
        "vendors-engaged"
      ],
      "Awaiting RFQ": ["pending"],
      "RfQ Sent": ["rfq-sent"],
      "Quotation Upload Closed": ["quotation-upload-closed"],
      "Vendors Selected": ["vendors-selected"],
      Approved: ["approved"],
      "Vendors-Engaged": ["vendors-engaged"],
      Terminated: ["terminated"]
    },
    tenderProcessesLoading: true
  }),
  head: () => ({
    title: "Tender Processes · Hagul"
  }),
  meta: {
    pageName: "tender-processes.index"
  },
  methods: {
    ...mapActions({
      getTenderProcesses: "hagul/purchase/tenderProcesses/getTenderProcesses"
    }),
    setScope(scope) {
      this.bidStatusCodes = this.tenderProcessStatuses[scope];
      this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
      this.getTenderProcesses(this);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    bidSearch() {
      this.debounce(() => this.getTenderProcesses(this), 300);
    },
    statusScope(scope) {
      this.setScope(scope);
    }
  }
};
</script>
