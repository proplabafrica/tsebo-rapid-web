<template>
  <v-paginate class="mg-t-10" :list="technicians" perPage="30" v-if="!loading">
    <template v-slot="paginate">
      <div class="row row-sm" v-if="paginate.list.length > 0">
        <div
          class="col-md-4 col-lg-3 mg-t-20 mg-md-t-0 mg-b-10 pd-x-5"
          v-for="technician in paginate.list"
          :key="technician.id"
        >
          <div class="card-contact">
            <div class="tx-center">
              <nuxt-link :to="`/people/users/details?id=${technician.user.id}`">
                <img
                  :src="
                    technician.user.image_path
                      ? technician.user.image_path
                      : 'https://via.placeholder.com/500'
                  "
                  @error="
                    (e) =>
                      (e.target.src = 'https://via.placeholder.com/500')
                  "
                  class="card-img"
                  :alt="technician.user.name"
                />
              </nuxt-link>
              <h5 class="mg-t-10 mg-b-5">
                <nuxt-link
                  :to="`/people/technicians/details?id=${technician.user.id}`"
                  class="contact-name"
                  >{{ technician.user.name }}</nuxt-link
                >
              </h5>
            </div>
            <!-- tx-center -->

            <p class="contact-item">
              <span>Phone:</span>
              <span>{{ technician.user.phone }}</span>
            </p>
            <!-- contact-item -->
            <p class="contact-item">
              <span>Email:</span>
              <a href>{{ technician.user.email }}</a>
            </p>
            <!-- contact-item -->
          </div>
          <!-- card -->
        </div>
      </div>
      <h4 v-else>No data to display</h4>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getTechnicians();
  },
  data: () => ({
    loading: true,
    technicians: []
  }),
  head: () => ({
    title: "Technicians · Hagul"
  }),
  meta: {
    pageName: "technicians.index"
  },
  methods: {
    async getTechnicians() {
      var {
        associations,
        refresh,
        technicians,
        pagination
      } = this.$store.state.people.technicians;

      const { page, perPage } = pagination;

      if (refresh == false) {
        this.loading = false;
        return (this.technicians = technicians);
      }

      try {
        const response = await this.$axios.get("technicians", {
          params: { associations, page, perPage }
        });
        this.$store.commit(
          "people/technicians/setTechnicians",
          response.data.data
        );
        this.$store.commit("people/technicians/setPagination", response.data);
        this.technicians = this.$store.state.people.technicians.technicians;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }

      return true;
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
