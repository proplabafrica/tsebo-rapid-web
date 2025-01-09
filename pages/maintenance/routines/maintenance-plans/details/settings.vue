<template>
  <div v-if="maintenancePlan">
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/maintenance/routines/maintenance-plans/details/settings?id=${maintenancePlan.id}`"
          class="nav-link"
          exact-active-class="active"
          >General</nuxt-link
        >
      </nav> 
    </div>
    <nuxt-child :maintenancePlan="maintenancePlan" @update="$emit('update')" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import layoutMixin from "@/mixins/layout";

export default {
  components: { loading },
  created() {
    this.setMaintenancePlan(this.$route.query.id);
  },
  meta: {
    pageName: "maintenance-plans.update"
  },
  data: () => ({
    maintenancePlan: null,
    apiPagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    unit: null,
    shouldRefresh: false,
    loading: true
  }),
  methods: {
    async setMaintenancePlan(id) {
      const {
        associations
      } = this.$store.state.maintenance.maintenancePlans;
      this.loading = true; 
      try {
        const response = await this.$axios.get("maintenance-plans/" + id, {
          params: { associations: associations }
        });
        this.$store.commit(
          "maintenance/maintenancePlans/setMaintenancePLan",
          response.data.maintenancePlan
        );
        this.maintenancePlan = response.data.maintenancePlan;
        this.loading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    setApiPagination({ total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      this.apiPagination = { total, perPage, page, lastPage };
    },
    updateMaintenancePlan() {
      this.shouldRefresh = true;
      this.setMaintenancePlan(this.$route.query.id);
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, layoutMixin],
  // props: ["maintenancePlan"]
};
</script>
