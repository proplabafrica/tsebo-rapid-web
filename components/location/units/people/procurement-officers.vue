<template>
  <div class="mg-t-10 card pd-10">
    <div class="slim-card-title">PROCUREMENT OFFICERS</div>
    <form id="sync-facility-managers-form" v-if="!unitProcurementOfficersLoading && !procurementOfficersLoading">
      <div v-if="procurementOfficers.length > 0">
        <v-paginate class="mg-t-10" :list="procurementOfficers" perPage="15">
          <template v-slot="paginate">
            <div class="row mg-0">
              <div class="col-md-6 col-lg-4 pd-md-0" v-for="procurementOfficer in paginate.list"
                :key="procurementOfficer.id">
                <ul class="list-group">
                  <li class="list-group-item vertical-align-center ht-60">
                    <p class="mg-b-0">
                      <nuxt-link class="tx-inverse" :to="`/people/users/details?id=${procurementOfficer.user.id}`">
                        <strong class="tx-medium" v-text="procurementOfficer.user.name"></strong>
                      </nuxt-link>
                      <label class="ckbox float-right">
                        <input type="checkbox" :value="procurementOfficer.id" v-model="procurement_officer_ids" />
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
          <v-button :disabled="disabled" @click="syncProcurmentOfficers()" class="btn btn-primary">SAVE</v-button>
        </div>
      </div>
      <h5 class="mg-t-10" v-else>No procurement officers in this organization</h5>
    </form>
    <loading v-else />
  </div>
</template>

<script>
import { concat, find } from "lodash";

import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";

export default {
  components: { loading, vButton, vPaginate },
  created() {
    this.getUnitProcurementOfficers();
    this.getProcurementOfficers();
  },
  data: () => ({
    disabled: false,
    procurementOfficers: [],
    procurementOfficersLoading: true,
    procurement_officer_ids: [],
    procurement_officer_ids_to_delete: [],
    unitProcurementOfficersLoading: true,
    validationErrors: {}
  }),
  methods: {
    async syncProcurmentOfficers() {
      const procurement_officer_ids = this.procurement_officer_ids;
      const unit_id = this.unit.id;
      this.disabled = true;
      try {
        await this.$axios.post("units/sync-procurement-officers", {
          procurement_officer_ids,
          unit_id
        });
        this.toast({ type: "info", title: "Procurement Officers List Updated" });
        this.disabled = false;
        this.getUnitProcurementOfficers();
      } catch (error) {
        console.log(error);
        this.toast({
          type: "warning",
          title: "Update Error",
          body: "Error Updating Procurment Officer List"
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
    async getProcurementOfficers() {
      const byOrganizationId = this.unit.organization.id;

      try {
        const procurementOfficers = (
          await this.$axios.get("procurement-officers", {
            params: { associations: ["user"], byOrganizationId }
          })
        ).data.data;
        this.procurementOfficers = procurementOfficers.map((fm) => {
          fm.name = fm.user.name;
          return fm;
        });
        this.procurementOfficersLoading = false;

      } catch (error) {
        console.log(error);
      }
    },
    async getUnitProcurementOfficers() {
      this.unitProcurementOfficersLoading = true;
      try {
        this.procurement_officer_ids = (
          await this.$axios.get(`units/${this.unit.id}`, {
            params: { associations: ["procurementOfficers.user"] }
          })
        ).data.unit.procurementOfficers.map((fm) => fm.id);

        this.unitProcurementOfficersLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: ["unit"]
};
</script>
