<template>
  <form id="update-unit-form" class="bg-white pd-20" v-if="
    authUser.roles[0].code == 'SYS' ||
    authUser.roles[0].code == 'OA' ||
    authUser.roles[0].code == 'FM'
  ">
    <div class="form-layout">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Name:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="name" v-model="editedUnit.name" required />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">Code:</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-grid-view-outline tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="code" v-model="editedUnit.code" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-5">
          <div class="form-group">
            <label class="form-control-label">
              Budget
              <span v-if="editedUnit.budget">({{ { value: editedUnit.budget } | toMoney }})</span>
            </label>
            <div class="input-group"></div>
            <input class="form-control" type="number" min="0" name="budget" v-model="editedUnit.budget"
              placeholder="Budget" />
          </div>
          <!-- input-group -->
          <small class="tx-danger tx-bold" v-if="validationErrors.budget" v-text="validationErrors.budget"></small>
        </div>
        <div class="col-md-7">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Address:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-location tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <textarea class="form-control" type="text" name="address" v-model="editedUnit.address"
                required></textarea>
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.address" v-text="validationErrors.address"></small>
          </div>
        </div>
        <!-- col-7 -->

        <div class="col-md-6">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Country
              <span class="tx-danger">*</span>
            </label>
            <select name="country_code" class="form-control" required v-model="editedUnit.country_code"
              @change="editedUnit.state = null">
              <option :value="null">Select a Country</option>
              <option v-for="country in countries" :key="country.alpha2Code" :value="country.alpha2Code"
                v-text="country.name"></option>
            </select>
            <small class="tx-danger tx-bold" v-if="validationErrors.country_code"
              v-text="validationErrors.country_code"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              State/Province
              <span class="tx-danger" v-if="statesByCountry.length > 0">*</span>
            </label>
            <select name="state" class="form-control" v-model="editedUnit.state" :required="statesByCountry.length > 0">
              <option :value="null">Select a State/Province</option>
              <option v-for="state in statesByCountry" :key="state.name" :value="state.name" v-text="state.name">
              </option>
            </select>
            <small class="tx-danger tx-bold" v-if="validationErrors.state" v-text="validationErrors.state"></small>
          </div>
        </div>
        <!-- col-6 -->
      </div>
      <!-- row -->
      <div class="form-layout-footer tx-center">
        <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="updateUnit()">UPDATE</v-button>
      </div>
      <!-- form-group -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: { vButton },
  computed: {
    statesByCountry() {
      if (this.editedUnit.country_code == null) return [];
      return this.states.filter(
        (state) => state.country_code == this.editedUnit.country_code
      );
    }
  },
  created() {
    this.setEditedUnit();
    this.getCountries();
    this.getStates();
  },
  data: () => ({
    countries: [],
    disabled: false,
    editedUnit: null,
    states: [],
    validationErrors: {}
  }),
  head: () => ({
    title: "Unit Settings · Tsebo-Rapid"
  }),
  methods: {
    setEditedUnit() {
      const {
        name,
        code,
        budget,
        address: { address, country_code, state },
        start_date,
        end_date
      } = this.unit;
      this.editedUnit = Object.assign(
        {},
        {
          name,
          code,
          budget,
          address,
          country_code,
          state,
          start_date,
          end_date
        }
      );
    },
    updateZone() {
      var country = document.getElementById("country");
      var zone = country.options[country.selectedIndex].text;

      this.editedUnit.zone = zone;
    },
    async updateUnit() {
      if (!this.validateForm("update-unit-form")) return false;

      this.disabled = true;

      try {
        await this.$axios.put(`units/${this.unit.id}`, { ...this.editedUnit });
        this.toast({ type: "info", title: "Unit Updated" });
        this.$emit("update");
      } catch (error) {
        this.toast({ type: "danger", title: "Error Updating Unit" });
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        }
      }
    }
  },
  mixins: [authMixin, formMixin, onboardingMixin],
  props: ["unit"]
};
</script>
