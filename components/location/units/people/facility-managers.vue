<template>
  <div class="mg-t-10 card pd-10">
    <div class="slim-card-title">FACILITY MANAGERS</div>
    <form id="sync-facility-managers-form" v-if="!unitFacilityManagersLoading && !facilityManagersLoading">
      <div v-if="facilityManagers.length > 0">
        <v-paginate class="mg-t-10" :list="facilityManagers" perPage="15">
          <template v-slot="paginate">
            <div class="row mg-0">
              <div class="col-md-6 col-lg-4 pd-md-0" v-for="facilityManager in paginate.list" :key="facilityManager.id">
                <ul class="list-group">
                  <li class="list-group-item vertical-align-center ht-60">
                    <p class="mg-b-0">
                      <nuxt-link class="tx-inverse" :to="`/people/users/details?id=${facilityManager.user.id}`">
                        <strong class="tx-medium" v-text="facilityManager.user.name"></strong>
                      </nuxt-link>
                      <label class="ckbox float-right">
                        <input type="checkbox" :value="facilityManager.id" v-model="facility_manager_ids" />
                        <span>
                          <span class="d-none">ok</span>
                        </span>
                      </label>
                    </p>
                  </li>
                </ul>
              </div>
              <!-- col-4 -->
            </div>
            <!-- row -->
          </template>
          <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
        </v-paginate>
        <div class="form-layout-footer tx-center mg-t-20">
          <v-button :disabled="disabled" @click="syncFacilityManagers()" class="btn btn-primary">SAVE</v-button>
        </div>
      </div>
      <h5 class="mg-t-10" v-else>No facility managers in this organization</h5>
    </form>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";

export default {
  components: { loading, vButton, vPaginate },
  created() {
    this.getUnitFacilityManagers();
    this.getFacilityManagers();
  },
  data: () => ({
    disabled: false,
    facilityManagers: [],
    facilityManagersLoading: true,
    facility_manager_ids: [],
    facility_manager_ids_to_delete: [],
    unitFacilityManagersLoading: true,
    validationErrors: {}
  }),
  methods: {
    async syncFacilityManagers() {
      const facility_manager_ids = this.facility_manager_ids;
      const unit_id = this.unit.id;
      this.disabled = true;
      try {
        await this.$axios.post("units/sync-facility-managers", {
          facility_manager_ids,
          unit_id
        });
        this.toast({ type: "info", title: "Facility Manager List Updated" });
        this.disabled = false;
        this.getUnitFacilityManagers();
      } catch (error) {
        console.log(error);
        this.toast({
          type: "warning",
          title: "Update Error",
          body: "Error Updating Occupants List"
        });
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
        }
      }
    },
    async getFacilityManagers() {
      const byOrganizationId = this.unit.organization.id;

      try {
        const facilityManagers = (
          await this.$axios.get("facility-managers", {
            params: { associations: ["user"], byOrganizationId }
          })
        ).data.data;
        this.facilityManagers = facilityManagers.map((fm) => {
          fm.name = fm.user.name;
          return fm;
        });
        this.facilityManagersLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getUnitFacilityManagers() {
      this.unitFacilityManagersLoading = true;
      try {
        this.facility_manager_ids = (
          await this.$axios.get(`units/${this.unit.id}`, {
            params: { associations: ["facilityManagers.user"] }
          })
        ).data.unit.facilityManagers.map((fm) => fm.id);

        this.unitFacilityManagersLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: ["unit"]
};
</script>
