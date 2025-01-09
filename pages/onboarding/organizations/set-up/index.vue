<template>
  <form id="organization-details-form" class="pd-t-5 pd-lg-t-0 pd-lg-l-10">
    <div class="form-layout">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Organization Name:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="name" v-model="organization.name" required
                placeholder="Organization Name" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Organization Code:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="code" v-model="organization.code" required
                placeholder="Organization Code" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Contact Person:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-person tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="text" name="contact_person_name"
                v-model="organization.contact_person_name" required placeholder="Contact Person" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.contact_person_name"
              v-text="validationErrors.contact_person_name"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-5">
          <div class="form-group mg-md-l--1">
            <label class="form-control-label">
              Email:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-email tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input class="form-control" type="email" name="contact_person_email"
                v-model="organization.contact_person_email" required placeholder="Contact Email" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.contact_person_email"
              v-text="validationErrors.contact_person_email"></small>
          </div>
        </div>
        <!-- col-5 -->
        <div class="col-md-7">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Head Office Address:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-location tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <textarea class="form-control" type="text" name="address" v-model="organization.address" required
                placeholder="Address"></textarea>
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.address" v-text="validationErrors.address"></small>
          </div>
        </div>
        <!-- col-7 -->
        <div class="col-md-4">
          <div class="form-group mg-md-l--1 bd-t-0-force">
            <label class="form-control-label mg-b-0-force">
              Country:
              <span class="tx-danger">*</span>
            </label>
            <select class="form-control" v-model="organization.country_code" name="country_code" required>
              <option :value="null">Choose a Country</option>
              <option v-for="country in countries" :key="country.alpha2Code" :value="country.alpha2Code"
                v-text="country.name"></option>
            </select>
            <small class="tx-danger tx-bold" v-if="validationErrors.country_code"
              v-text="validationErrors.country_code"></small>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group mg-md-l--1">
            <label class="form-control-label mg-b-0-force">
              Industry:
              <span class="tx-danger">*</span>
            </label>
            <select class="form-control" v-model="organization.industry_id" name="industry_id" required>
              <option :value="null">Choose an Industry</option>
              <option v-for="industry in industries" :key="industry.id" :value="industry.id" v-text="industry.name">
              </option>
            </select>
            <small class="tx-danger tx-bold" v-if="validationErrors.industry_id"
              v-text="validationErrors.industry_id"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-4">
          <div class="form-group mg-md-l--1">
            <label class="form-control-label mg-b-0-force">
              Organization Type:
              <span class="tx-danger">*</span>
            </label>
            <select class="form-control" v-model="organization.organization_type_id" name="organization_type_id"
              required>
              <option :value="null">Choose an Organization Type</option>
              <option v-for="organizationType in organizationTypes" :key="organizationType.id"
                :value="organizationType.id" v-text="organizationType.name"></option>
            </select>
            <small class="tx-danger tx-bold tx-10" v-if="validationErrors.organization_type_id"
              v-text="validationErrors.organization_type_id"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-lg-4 form-group">
          <label class="form-control-label">Logo (Max 2MB)</label>
          <div class="custom-file image-input">
            <input type="file" accept="image/*" @change="
              convertToBase64($event).then((data) => {
                organization.image = data.file;
                organization.image_name = data.file_name;
              })
            " class="custom-file-input" name="image" title="Select an image 1MB or less" />
            <label class="custom-file-label" for="customFile" v-text="organization.image_name"></label>
          </div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.image" v-text="validationErrors.image"></small>
        </div>
      </div>
      <!-- row -->
      <div class="form-layout-footer pd-20 ht-80">
        <v-button class="btn btn-primary bd-0 float-right" :diabled="disabled" @click="submitDetails()">Next &rarr;
        </v-button>
      </div>
      <!-- form-group -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";
import vButton from "@/components/ui/v-button";

export default {
  components: { vButton },
  created() {
    this.getCountries();
    this.getIndustries();
    this.getOrganizationTypes();
  },
  data: () => ({
    countries: [],
    disabled: false,
    industries: [],
    organizationTypes: [],
    organization: {
      address: "",
      contact_person_name: "",
      contact_person_email: "",
      country_code: null,
      industry_id: null,
      name: "",
      code: "",
      organization_type_id: null,
      image: null,
      image_name: "Select Image"
    },
    validationErrors: {}
  }),
  methods: {
    async submitDetails() {
      if (!this.validateForm("organization-details-form")) return false;
      this.disabled = true;

      try {
        const organization = (
          await this.$axios.post("organizations", this.organization)
        ).data.organization;
        this.$store.commit(
          "onboarding/organizations/setOrganization",
          organization
        );
        this.$store.commit("onboarding/orgnizations/toggleRefresh");
        this.disabled = false;
        this.$emit("detailsDone", { organization });
      } catch (error) {
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422)
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
      }
    }
  },
  mixins: [formMixin, onboardingMixin]
};
</script>
