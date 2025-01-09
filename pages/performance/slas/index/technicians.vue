<template>
  <div class="float-left wd-100p mg-t-5">
    <v-paginate v-if="!techniciansLoading" :list="technicians" perPage="60">
      <template v-slot="paginate">
        <div class="row mg-0" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 mg-t-20 mg-md-t-0 mg-b-10 pd-x-5" v-for="technician in paginate.list"
            :key="`technician-${technician.id}`">
            <div class="card-contact">
              <div class="tx-center">
                <nuxt-link :to="`/people/users/details?id=${technician.user.id}`">
                  <img :src="
                    technician.user.image_path
                      ? technician.user.image_path
                      : 'https://via.placeholder.com/500'
                  " @error="
                    (e) =>
                      (e.target.src = 'https://via.placeholder.com/500')
                  " class="card-img" :alt="technician.user.name" />
                </nuxt-link>
                <h5 class="mg-t-10 mg-b-5">
                  <nuxt-link :to="`/people/users/details?id=${technician.user.id}`" class="contact-name">{{
                  technician.user.name }}</nuxt-link>
                </h5>
              </div>
              <!-- tx-center -->

              <p class="contact-item">
                <span>Speed Rating:</span>
                <span>{{
                ((technician.performance.speed_rating /
                technician.performance.max_score) *
                100)
                | twoDP
                }}%</span>
              </p>
              <!-- contact-item -->

              <p class="contact-item">
                <span>Quality Rating:</span>
                <span>{{
                ((technician.performance.quality_rating /
                technician.performance.max_score) *
                100)
                | twoDP
                }}%</span>
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
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getTechnicians(this);
  },
  data: () => ({
    technicians: [],
    techniciansLoading: true
  }),
  head: () => ({
    title: "Technician Performance · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    ...mapActions({
      getTechnicians: "people/technicians/getTechnicians"
    })
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
