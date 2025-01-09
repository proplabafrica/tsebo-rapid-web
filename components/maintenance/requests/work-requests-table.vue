<template>
  <v-paginate
    class="bg-white"
    :list="workRequests"
    v-if="!$parent.workRequestsLoading"
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
              <td colspan="3">
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
  components: { loading, vPaginate, quickRequestData },
  data: () => ({
    equipment: null,
    apiPagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    workRequestsEquipmentId: null,
    workRequestsLoading: true,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc",
    shouldRefresh: false
  }),
  mixins: [authMixin],
  props: ["workRequests"]
};
</script>
