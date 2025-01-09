<template>
  <div class="float-left wd-100p mg-t-5">
    <v-paginate v-if="!facilityManagersLoading" :list="facilityManagers" perPage="60">
      <template v-slot="paginate">
        <div class="row mg-0" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 mg-t-20 mg-md-t-0 mg-b-10 pd-x-5" v-for="facilityManager in paginate.list"
            :key="`facility-manager-${facilityManager.id}`">
            <div class="card-contact">
              <div class="tx-center">
                <nuxt-link :to="`/people/users/details?id=${facilityManager.user.id}`">
                  <img :src="
                    facilityManager.user.image_path
                      ? facilityManager.user.image_path
                      : 'https://via.placeholder.com/500'
                  " @error="
                    (e) => (e.target.src = 'https://via.placeholder.com/500')
                  " class="card-img" :alt="facilityManager.user.name" />
                </nuxt-link>
                <h5 class="mg-t-10 mg-b-5">
                  <nuxt-link :to="`/people/users/details?id=${facilityManager.user.id}`" class="contact-name">{{
                  facilityManager.user.name }}</nuxt-link>
                </h5>
                <p class="contact-item">
                  <span>Phone:</span>
                  <span>{{ facilityManager.user.phone }}</span>
                </p>
                <!-- contact-item -->
                <p class="contact-item">
                  <span>Email:</span>
                  <a href>{{ facilityManager.user.email }}</a>
                </p>
              </div>

              <!-- tx-center -->

              <!-- <p class="contact-item">
                <span>Reaction Time::</span>
                <span
                  >{{
                    ((facilityManager.sla_reaction_time.timelyRequests /
                      facilityManager.sla.count) *
                      100)
                      | twoDP
                  }}%</span
                >
              </p> -->
              <!-- contact-item -->

              <!-- <p class="contact-item">
                <span>Response Time::</span>
                <span
                  >{{
                    ((facilityManager.sla_response_time.timelyRequests /
                      facilityManager.sla.count) *
                      100)
                      | twoDP
                  }}%</span
                >
              </p> -->
              <!-- contact-item -->
              <!-- <p class="contact-item">
                <span>Completion Time:</span>
                <span
                  >{{
                    ((facilityManager.sla_completion_time.timelyRequests /
                      facilityManager.sla.count) *
                      100)
                      | twoDP
                  }}%</span
                >
              </p> -->
              <!-- contact-item -->
            </div>
            <!-- card -->
          </div>
        </div>
        <!-- row -->
        <div v-else>
          <h4>No data to display</h4>
        </div>
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <!-- v-paginate -->
    <loading v-else />
    <!-- </div> -->
  </div>
</template>

<script>
import moment from "moment";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    // this.getFacilityManagerSlas(); // Temporary remove facility managers sla logic
    this.getFacilityManagersData();
  },
  data: () => ({
    facilityManagerSlas: [],
    facilityManagerSlasLoading: true,

    facilityManagers: [],
    facilityManagersLoading: true
  }),
  head: () => ({
    title: "Facility Manager SLA Performance · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    dateToAYearAgo(date) {
      const aYearAgo = new Date(date.setFullYear(date.getFullYear() - 1));
      date = new Date(date.setFullYear(date.getFullYear() + 1));

      return {
        rangeFrom: moment(
          new Date(aYearAgo.getFullYear(), aYearAgo.getMonth(), 1)
        ).format("YYYY-MM-DD"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD")
      };
    },
    async getFacilityManagerSlas() {
      const dateRange = this.dateToAYearAgo(new Date());

      try {
        const response = await this.$axios.get(
          "reporting/facility-managers/work-request-sla",
          {
            params: {
              facilityManagerAssociations: ["units", "user"],
              facilityManagerPerPage: 300,
              workRequestRangeBy: "created_at",
              workRequestRangeFrom: dateRange.rangeFrom,
              workRequestRangeTo: dateRange.rangeTo
            }
          }
        );
        this.facilityManagerSlas = response.data.data;
        this.facilityManagerSlasLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getFacilityManagersData() {
      try {
        const response = await this.$axios.get("/facility-managers", {
          params: {
            associations: ["units", "user"]
          }
        });
        this.facilityManagers = response.data.data;
        this.facilityManagersLoading = false;
      } catch (e) {
        console.log(e);
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
