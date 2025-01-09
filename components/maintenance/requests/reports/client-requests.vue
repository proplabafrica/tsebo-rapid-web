<template>
  <div>
    <input
      type="text"
      placeholder="Start typing here to search"
      class="form-control search mg-y-10"
      v-model="clientRequestSearch"
    />
    <v-paginate
      class="col mg-t-5"
      v-if="!clientRequestsLoading"
      :list="clientRequests"
      perPage="42"
    >
      <template v-slot="paginate">
        <div class="row" v-if="paginate.list.length > 0">
          <div
            class="col-md-3 col-lg-2 pd-md-0"
            v-for="clientRequest in paginate.list"
            :key="clientRequest.id"
          >
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <nuxt-link
                  :to="`/maintenance/requests/approval?id=${clientRequest.id}`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  >{{ clientRequest.name }}</nuxt-link
                >
                <span class="tx-11 d-block tx-uppercase">
                  <nuxt-link
                    v-if="clientRequest.unit"
                    :to="`/location/units/details?id=${clientRequest.unit.id}`"
                    class="tx-inverse d-block"
                    >{{ clientRequest.unit.name }}</nuxt-link
                  >
                  <nuxt-link
                    v-if="clientRequest.unit.parent"
                    :to="
                      `/location/units/details?id=${clientRequest.unit.parent.id}`
                    "
                    class="tx-inverse d-block"
                    >({{ clientRequest.unit.parent.name }})</nuxt-link
                  >
                </span>
                <span class="tx-11 d-block">{{
                  clientRequest.status.name
                }}</span>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
        <h4 class="mg-10" v-else>No data to display</h4>
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
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";

export default {
  components: { loading, vPaginate },
  created() {
    this.getClientRequests(this);
  },
  data: () => ({
    clientRequests: [],
    clientRequestsLoading: true,
    clientRequestsPerPage: 42,
    clientRequestSearch: null,
    clientRequestsSortBy: "updated_at",
    clientRequestsSortOrder: "desc",
    clientRequestStatusCodes: ["pending", "clarification"]
  }),
  methods: {
    ...mapActions({
      getClientRequests: "maintenance/clientRequests/getClientRequests"
    })
  },
  watch: {
    $route(to) {
      this.setScope(to.query.scope);
    },
    clientRequestSearch(search) {
      this.debounce(() => {
        this.getClientRequests(this);
      }, 300);
    }
  }
};
</script>
