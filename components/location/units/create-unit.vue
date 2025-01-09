<template>
  <form :id="`create-unit-form-${hierarchy.id}`" class="pd-t-10 pd-lg-l-10">
    <div class="form-layout">
      <div class="row mg-x-0">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Unit Name
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="name" v-model="unit.name" required placeholder="Name" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Code
              <i class="icon ion-ios-help-outline" title="Unit Code"></i>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-grid-view-outline tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="code" v-model="unit.code" placeholder="Code" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-5" v-if="hierarchies">
          <div class="form-group mg-md-l--1">
            <label class="form-control-label">
              Level:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-easel tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <select name="unit_hierarchy_id" v-model="unit.unit_hierarchy_id" class="form-control" required>
                <option :value="null">Choose Level</option>
                <option v-for="hierarchy in hierarchies" :key="hierarchy.id" :value="hierarchy.id"
                  v-text="hierarchy.name"></option>
              </select>
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.unit_hierarchy_id"
              v-text="validationErrors.unit_hierarchy_id"></small>
          </div>
        </div>
        <!-- col-5 -->
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
              <textarea class="form-control" type="text" name="address" v-model="unit.address" required
                placeholder="Address"></textarea>
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.address" v-text="validationErrors.address"></small>
          </div>
        </div>
        <!-- col-7 -->
        <div class="col-md-5">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Country
              <span class="tx-danger">*</span>
            </label>
            <select name="country_code" class="form-control" required v-model="unit.country_code"
              @change="unit.state = null">
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
            <select name="state" class="form-control" v-model="unit.state" :required="statesByCountry.length > 0">
              <option :value="null">Select a State/Province</option>
              <option v-for="state in statesByCountry" :key="state.name" :value="state.name" v-text="state.name">
              </option>
            </select>
            <small class="tx-danger tx-bold" v-if="validationErrors.state" v-text="validationErrors.state"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Budget
              <span v-if="unit.budget">({{ { value: unit.budget } | toMoney }})</span>
            </label>
            <div class="input-group"></div>
            <input class="form-control" type="number" min="0" name="budget" v-model="unit.budget" placeholder="Budget" />
          </div>
          <!-- input-group -->
          <small class="tx-danger tx-bold" v-if="validationErrors.budget" v-text="validationErrors.budget"></small>
        </div>
      </div>
    </div>
    <!-- row -->
    <div class="form-layout-footer pd-20 ht-80 tx-center">
      <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitUnit()">SUBMIT</v-button>
    </div>
    <!-- form-group -->
    <!-- </div> -->
    <!-- form-layout -->
  </form>
</template>

<script>
import vButton from "@/components/ui/v-button";
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";

const getInitialData = () => ({
  countries: [],
  disabled: false,
  states: [],
  unit: {
    name: null,
    code: null,
    unit_hierarchy_id: null,
    address: null,
    country_code: "NG",
    state: null,
    budget: null
  },
  validationErrors: {}
});

export default {
  components: { vButton },
  computed: {
    statesByCountry() {
      if (this.unit.country_code == null) return [];
      return this.states.filter(
        state => state.country_code == this.unit.country_code
      );
    }
  },
  created() {
    this.getCountries();
    this.getStates();
  },
  data: () => getInitialData(),
  methods: {
    async submitUnit() {
      if (!this.validateForm("create-unit-form")) {
        return false;
      }
      this.disabled = true;
      if (this.unit.unit_hierarchy_id == null)
        this.unit.unit_hierarchy_id = this.hierarchy.id;
      const parent_unit_id = this.parentUnit?.id ? this.parentUnit.id : null;
      const organization_id = this.organization?.id;


      try {
        await this.$axios.post("units", {
          ...this.unit,
          parent_unit_id,
          organization_id
        });
        const { countries, states } = this;
        var initialData = Object.assign(getInitialData(), {
          countries,
          states
        });
        Object.assign(this.$data, initialData);
        this.toast({ type: "info", title: "Unit Created" });
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }
  },
  mixins: [formMixin, onboardingMixin],
  props: ["hierarchies", "organization", "parentUnit", "hierarchy"]
};
</script>
