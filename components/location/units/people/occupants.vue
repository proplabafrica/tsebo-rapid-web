<template>
  <div class="mg-t-10 card pd-10">
    <div class="slim-card-title">OCCUPANTS</div>
    <form id="sync-occupants-form" v-if="!unitOccupantsLoading && !occupantsLoading">
      <div v-if="occupants.length > 0">
        <v-paginate class="mg-t-10" :list="occupants" perPage="15">
          <template v-slot="paginate">
            <div class="row mg-0">
              <div class="col-md-6 col-lg-4 pd-md-0" v-for="occupant in paginate.list" :key="occupant.id">
                <ul class="list-group">
                  <li class="list-group-item ht-60">
                    <p class="mg-b-0">
                      <nuxt-link class="tx-inverse" :to="`/people/users/details?id=${occupant.user.id}`">
                        <strong class="tx-medium" v-text="occupant.user.name"></strong>
                      </nuxt-link>
                      <label class="ckbox float-right">
                        <input type="checkbox" :value="occupant.id" v-model="occupant_ids" />
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
          <v-button :disabled="disabled" @click="syncOccupants()" class="btn btn-primary">SAVE</v-button>
        </div>
      </div>
      <h5 class="mg-t-10" v-else>No ccupants in this organization</h5>
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
    this.getUnitOccupants();
    this.getOccupants();
  },
  data: () => ({
    disabled: false,
    occupants: [],
    occupantsLoading: true,
    occupant_ids: [],
    occupant_ids_to_delete: [],
    unitOccupantsLoading: true,
    validationErrors: {}
  }),
  methods: {
    async syncOccupants() {
      const occupant_ids = this.occupant_ids;
      const unit_id = this.unit.id;
      this.disabled = true;
      try {
        await this.$axios.post("units/sync-occupants", {
          occupant_ids,
          unit_id
        });
        this.disabled = false;
        this.toast({ type: "info", title: "Occupant List Updated" });
        this.getUnitOccupants();
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        this.toast({ type: "danger", title: "Occupant Update Failed" });
        if (response && response.status && response.status == 422) {
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
          response;
        }
      }
    },
    async getOccupants() {
      const byOrganizationId = this.unit.organization.id;

      try {
        const occupants = (
          await this.$axios.get("occupants", {
            params: { associations: ["user"], byOrganizationId }
          })
        ).data.data;
        this.occupants = occupants.map((occupant) => {
          occupant.name = occupant.user.name;
          return occupant;
        });
        this.occupantsLoading = false;
      } catch (error) {
      }
    },
    async getUnitOccupants() {
      this.unitOccupantsLoading = true;
      try {
        this.occupant_ids = (
          await this.$axios.get(`units/${this.unit.id}`, {
            params: { associations: ["occupants.user"] }
          })
        ).data.unit.occupants.map((occupant) => occupant.id);

        this.unitOccupantsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: ["unit"]
};
</script>
