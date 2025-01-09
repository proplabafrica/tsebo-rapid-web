<template>
    <div v-if="jobSchedule">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link
                :to="`/maintenance/routines/job-schedules/details/settings?id=3`"
                class="nav-link"
                exact-active-class="active"
            >General</nuxt-link>
          </nav>
        </div>
        <nuxt-child 
          :jobSchedule="jobSchedule"
        />
    </div>
</template>

<script>
    import loading from "@/components/ui/loading";
    import authMixin from "@/mixins/auth";
    import layoutMixin from "@/mixins/layout";

    export default {
      components: { loading },
      meta: {
        pageName: "job-schedule.update",
      },
      created() {
        this.setJobSchedule(this.$route.query.id)
      },
      data: () => ({
        jobSchedule: null,
        shouldRefresh: false,
        loading: true,
        pagination: {
          total: 0,
          perPage: 100,
          page: 1,
          lastPage: null
        }
      }),
      methods: {
          async setJobSchedule(id) {
            const {
              detailedAssociations
            } = this.$store.state.maintenance.jobSchedules;
            this.loading = true;
            try {
              const response = await this.$axios.get("job-schedules/" + id, {
                params: { associations: detailedAssociations }
              })
            this.$store.commit(
              "maintenance/jobSchedules/setJobSchedule",
              response.data.jobSchedule
            )
            this.jobSchedule = response.data.jobSchedule;
            this.loading = false;
            this.shouldRefresh = false;
            } catch (e) {
              console.log(e);
            }
          },
          updatejobSchedule() {
            this.shouldRefresh = true;
            this.setJobSchedule(this.$route.query.id)
          }
      },
      middleware:["auth"],
      mixins: [authMixin, layoutMixin],
  }

</script>