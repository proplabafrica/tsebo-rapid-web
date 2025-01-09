<template>
  <form id="update-organization-form" class="bg-white pd-20" v-if="editedOrganization">
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
              <input v-if="!isFM" class="form-control" type="text" name="name" v-model="editedOrganization.name" required
                placeholder="Name" />
              <input v-if="isFM" class="form-control" type="text" name="name" v-model="editedOrganization.name"
                disabled=true required placeholder="Name" />
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
              <input v-if="!isFM" class="form-control" type="text" name="code" v-model="editedOrganization.code"
                placeholder="Code" />
              <input v-if="isFM" class="form-control" type="text" name="code" disabled=true
                v-model="editedOrganization.code" placeholder="Code" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Contact Person Name:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input v-if="!isFM" class="form-control" type="text" name="contact_person_name"
                v-model="editedOrganization.contact_person_name" required placeholder="Contact Person Name" />
              <input v-if="isFM" class="form-control" type="text" name="contact_person_name"
                v-model="editedOrganization.contact_person_name" required disabled=true
                placeholder="Contact Person Name" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.contact_person_name"
              v-text="validationErrors.contact_person_name"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Contact Person Email:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input v-if="!isFM" class="form-control" type="text" name="contact_person_email"
                v-model="editedOrganization.contact_person_email" required placeholder="Contact Person Email" />
              <input v-if="isFM" class="form-control" type="text" name="contact_person_email"
                v-model="editedOrganization.contact_person_email" required disabled=true
                placeholder="Contact Person Email" />
            </div>
            <!-- input-group -->
            <small class="tx-danger tx-bold" v-if="validationErrors.contact_person_email"
              v-text="validationErrors.contact_person_email"></small>
          </div>
        </div>
        <!-- col-6 -->
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
              <textarea v-if="!isFM" class="form-control" type="text" name="address" v-model="editedOrganization.address"
                required placeholder="Address"></textarea>
              <textarea v-if="isFM" class="form-control" type="text" name="address" v-model="editedOrganization.address"
                required disabled=true placeholder="Address"></textarea>
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
            <select v-if="!isFM" name="country_code" class="form-control" required
              v-model="editedOrganization.country_code">
              <option :value="null">Select a Country</option>
              <option v-for="country in countries" :key="country.alpha2Code" :value="country.alpha2Code"
                v-text="country.name"></option>
            </select>
            <!-- {{countries[0].name}} -->
            <input v-if="isFM" class="form-control" type="text" name="country_code" required disabled=true
              placeholder="Select a Country" />
            <small class="tx-danger tx-bold" v-if="validationErrors.country_code"
              v-text="validationErrors.country_code"></small>
          </div>
        </div>
        <!-- col-4 -->
        <div class="col-md-4">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Industry
              <span class="tx-danger">*</span>
            </label>
            <select v-if="!isFM" name="industry_id" class="form-control" required
              v-model="editedOrganization.industry_id">
              <option :value="null">Select an Industry</option>
              <option v-for="industry in industries" :key="industry.id" :value="industry.id" v-text="industry.name">
              </option>
            </select>
            <input v-if="isFM" class="form-control" type="text" name="industry_id" required disabled=true
              placeholder="Select an Industry" />
            <small class="tx-danger tx-bold" v-if="validationErrors.industry_id"
              v-text="validationErrors.industry_id"></small>
          </div>
        </div>
        <!-- col-4 -->
        <div class="col-md-4">
          <div class="form-group bd-t-0-force">
            <label class="form-control-label">
              Organization Type
              <span class="tx-danger">*</span>
            </label>
            <select v-if="!isFM" name="organization_type_id" class="form-control" required
              v-model="editedOrganization.organization_type_id">
              <option :value="null">Select an Organization Type</option>
              <option v-for="organizationType in organizationTypes" :key="organizationType.id"
                :value="organizationType.id" v-text="organizationType.name"></option>
            </select>
            <input v-if="isFM" class="form-control" type="text" name="organization_type_id" required disabled=true
              placeholder="Select an Organization Type" />
            <small class="tx-danger tx-bold" v-if="validationErrors.organization_type_id"
              v-text="validationErrors.organization_type_id"></small>
          </div>
        </div>
        <!-- col-4 -->
        <div class="col-lg-4 form-group" v-if="!isFM">
          <label class="form-control-label">Logo (Max 2MB)</label>
          <div class="custom-file image-input">
            <input v-if="!isFM" type="file" accept="image/*" @change="
              convertToBase64($event).then((data) => {
                editedOrganization.image = data.file;
                editedOrganization.image_name = data.file_name;
              })
            " class="custom-file-input" name="image" title="Select an image 1MB or less" />
            <label class="custom-file-label" for="customFile" v-text="editedOrganization.image_name"></label>
          </div>
          <div class="d-none" v-if="isFM"></div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.image" v-text="validationErrors.image"></small>
        </div>
        <!-- col-4 -->
      </div>
      <!-- row -->
      <div class="form-layout-footer tx-center">
        <v-button v-if="!isFM" class="btn btn-primary bd-0" :disabled="disabled" @click="updateOrganization()">UPDATE
        </v-button>
        <!-- <v-button
          v-if="isFM"
          class="btn btn-primary bd-0 d-none"
          :disabled="disabled"
          @click="updateOrganization()"
          >UPDATE</v-button
        > -->
      </div>
      <!-- form-group -->
    </div>
    <!-- form-layout -->
  </form>

  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: { loading, vButton },
  created() {
    this.setEditedOrganization();
    this.getCountries();
    this.getIndustries();
    this.getOrganizationTypes();
  },
  mounted() {
    this.getIsFM();
  },
  data: () => ({
    countries: [],
    disabled: false,
    editedOrganization: null,
    industries: [],
    organizationTypes: [],
    validationErrors: {},
    organizationLoading: true,
    isFM: false,

  }),
  head: () => ({
    title: "Organization Settings · Tsebo-Rapid"
  }),
  methods: {
    setEditedOrganization() {
      const {
        name,
        code,
        addresses,
        contacts,
        industries,
        types
      } = this.organization;

      this.editedOrganization = Object.assign(
        { image: null, image_name: "Select Image" },
        {
          name,
          code,
          address: addresses.length > 0 ? addresses[0].address : null,
          country_code: addresses.length > 0 ? addresses[0].country_code : null,
          contact_person_name: contacts.length > 0 ? contacts[0].name : null,
          contact_person_email: contacts.length > 0 ? contacts[0].email : null,
          industry_id: industries.length > 0 ? industries[0].id : null,
          organization_type_id: types.length > 0 ? types[0].id : null
        }
      );
    },
    async updateOrganization() {
      if (!this.validateForm("update-organization-form")) return false;

      this.organizationLoading = true;
      this.disabled = true;

      try {
        await this.$axios.put(`organizations/${this.organization.id}`, {
          ...this.editedOrganization
        });
        this.disabled = false;
        this.toast({ type: "info", title: "Organization Updated" });
        this.$emit("update");
      } catch (error) {
        this.toast({ type: "danger", title: "Error Updating Organization" });
        this.disabled = false;
        this.organizationLoading = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        }
      }
    },
    getIsFM() {
      if (this.authUser.roles) {
        for (const i in this.authUser.roles) {
          if (this.authUser.roles[i].code === "FM") {
            this.isFM = true;

            break;
          }
        }
      }
    },
  },
  mixins: [authMixin, formMixin, onboardingMixin],
  props: ["organization"]
};
</script>
