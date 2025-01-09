<template>
  <v-paginate
    class="bg-white"
    :list="workRequests"
    v-if="!workRequestsLoading"
    perPage="30"
  >
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Request</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="workRequest in paginate.list" :key="workRequest.id">
              <td>
                <quick-request-data :workRequest="workRequest" />
              </td>
              <td>
                <nuxt-link
                  class="tx-inverse"
                  :to="`/people/users/details?id=${workRequest.createdBy.id}`"
                  v-text="workRequest.createdBy.name"
                  v-if="authorized('people.users.details')"
                ></nuxt-link>
                <span
                  class="tx-inverse"
                  v-else
                  v-text="workRequest.createdBy.name"
                ></span>
              </td>
              <td>
                <span>{{ workRequest.created_at | dateFormat }}</span>
              </td>
              <td>
                <span v-text="workRequest.status.name"></span>
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
  </v-paginate>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, quickRequestData, vPaginate },
  computed: {
    workRequestsJobScheduleIds() {
      return [this.jobSchedule.id];
    }
  },
  created() {
    this.$store.commit("maintenance/workRequests/toggleRefresh");
    this.getWorkRequests(this);
  },
  data: () => ({
    workRequests: [],
    workRequestsLoading: true,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc"
  }),
  head() {
    return {
      title: this.jobSchedule
        ? `Jobs · ${this.jobSchedule.name} · ${this.authUser.organizations[0].name}`
        : `Jobs · ${this.authUser.organizations[0].name}`
    };
  },
  meta: {
    pageName: "job-schedules.index"
  },
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests"
    })
  },
  mixins: [authMixin],
  props: ["jobSchedule"]
};
</script>
