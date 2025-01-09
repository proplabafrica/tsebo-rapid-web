<template>
  <div class="manager-right" ref="managerRightRef">
    <v-paginate
      :list="users"
      perPage="30"
      v-if="!usersLoading"
    >
    <!-- v-if="!usersLoading && ['VND','QA', 'OA', 'OCC', 'SYS', 'FM', 'PO', 'PM', 'TCHN'].includes(role.code)" -->
      <template v-slot="paginate">
        <div class="row" v-if="paginate.list.length > 0">
          <div
            class="col-md-6 col-lg-4 mg-t-20 mg-md-t-0 mg-b-10 pd-x-5"
            v-for="user in paginate.list"
            :key="user.id"
          >
            <div class="users card-contact">
              <div class="tx-center">
                <nuxt-link :to="`/people/users/details?id=${user.id}`">
                  <img
                    :src="
                      user.image_path
                        ? user.image_path
                        : 'https://via.placeholder.com/500'
                    "
                    @error="
                      (e) =>
                        (e.target.src = 'https://via.placeholder.com/500')
                    "
                    class="card-img"
                    :alt="user.name"
                  />
                </nuxt-link>
                <h5 class="mg-t-10 mg-b-5">
                  <nuxt-link
                    :to="`/people/users/details?id=${user.id}`"
                    class="contact-name"
                    >{{ user.name }}</nuxt-link
                  >
                </h5>
              </div>
              <!-- tx-center -->

              <p class="contact-item">
                <span>Phone:</span>
                <span>{{ user.phone }}</span>
              </p>
              <!-- contact-item -->
              <p class="contact-item">
                <span>Email:</span>
                <a href>{{ user.email }}</a>
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
    <facility-manager-performance v-else-if="['FM'].includes(role.code)" />
    <procurement-user-performance
      v-else-if="['PO', 'PM'].includes(role.code)"
      :roleCodes="[role.code]"
    />
    <technician-performance v-else-if="['TCHN'].includes(role.code)" />
    <loading v-else />
  </div>
  <!-- manager-right -->
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import facilityManagerPerformance from "@/pages/performance/slas/index/facility-managers";
import procurementUserPerformance from "@/pages/performance/slas/index/procurement-users";
import technicianPerformance from "@/pages/performance/slas/index/technicians";

export default {
  components: {
    facilityManagerPerformance,
    loading,
    procurementUserPerformance,
    technicianPerformance,
    vPaginate
  },
  created() {
    this.getUsersByRole(this.$route.query["role-id"]);
  },
  data: () => ({
    role: null,
    users: [],
    usersLoading: true
  }),
  methods: {
    getUsersByRole(byRoleId = null) {
      this.role = this.roles.find((role) => role.id == byRoleId) || {
        code: "ALL"
      };
      const { associations, pagination } = this.$store.state.people.users;
      const { page, perPage } = pagination;
      this.usersLoading = true;

      this.$axios
        .get("users", { params: { associations, byRoleId, page, perPage } })
        .then((response) => {
          this.users = response.data.data;
          this.usersLoading = false;
          if (!byRoleId) this.usersTotal = response.data.total;
        })
        .catch((error) => console.log(error));
    }
  },
  props: ["roles"],
  watch: {
    $route(to, from) {
      this.getUsersByRole(to.query["role-id"]);
    }
  }
};
</script>
