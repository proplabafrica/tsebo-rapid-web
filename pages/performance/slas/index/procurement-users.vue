<template>
  <div class="float-left wd-100p mg-t-5">
    <v-paginate v-if="!procurementUserSlasLoading" :list="procurementUserSlas" perPage="60">
      <template v-slot="paginate">
        <div class="row mg-0" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 mg-t-20 mg-md-t-0 mg-b-10 pd-x-5" v-for="procurementUser in paginate.list"
            :key="`facility-manager-${procurementUser.id}`">
            <div class="card-contact">
              <div class="tx-center">
                <nuxt-link :to="`/people/users/details?id=${procurementUser.id}`">
                  <img :src="
                    procurementUser.image_path
                      ? procurementUser.image_path
                      : 'https://via.placeholder.com/500'
                  " @error="
                    (e) =>
                      (e.target.src = 'https://via.placeholder.com/500')
                  " class="card-img" :alt="procurementUser.name" />
                </nuxt-link>
                <h5 class="mg-t-10 mg-b-5">
                  <nuxt-link :to="`/people/users/details?id=${procurementUser.id}`" class="contact-name">{{
                  procurementUser.name }}</nuxt-link>
                </h5>
              </div>
              <!-- tx-center -->

              <p class="contact-item">
                <span>Response Time::</span>
                <span>{{
                ((procurementUser.sla_response_time.timelyRequests /
                procurementUser.sla.count) *
                100)
                | twoDP
                }}%</span>
              </p>
              <!-- contact-item -->
              <p class="contact-item">
                <span>Completion Time:</span>
                <span>{{
                ((procurementUser.sla_completion_time.timelyRequests /
                procurementUser.sla.count) *
                100)
                | twoDP
                }}%</span>
              </p>
              <!-- contact-item -->
              <p class="contact-item">
                <span>Quotation Performance:</span>
                <span>{{ (procurementUser.pricePerformance * 100) | twoDP }}%</span>
              </p>
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
    this.getprocurementUserSlas();
  },
  data: () => ({
    procurementUserSlas: [],
    procurementUserSlasLoading: true
  }),
  head: () => ({
    title: "Facility Manager SLA Performance · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    async getprocurementUserSlas() {
      this.procurementUserSlasLoading = true;
      const dateRange = this.dateToAYearAgo(new Date());
      const roleCodes = this.roleCodes || ["PO", "PM"];

      try {
        const response = await this.$axios.get(
          "reporting/procurement-users/work-request-sla",
          {
            params: {
              roleCodes,
              userAssociations: ["quotationPrices"],
              userPerPage: 300,
              workRequestRangeBy: "created_at",
              workRequestRangeFrom: dateRange.rangeFrom,
              workRequestRangeTo: dateRange.rangeTo
            }
          }
        );
        this.procurementUserSlas = response.data.data;
        this.procurementUserSlasLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
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
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  props: ["roleCodes"],
  watch: {
    roleCodes(val) {
      this.getprocurementUserSlas();
    }
  }
};
</script>
