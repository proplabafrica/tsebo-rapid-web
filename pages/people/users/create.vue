<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/manage">Manage</nuxt-link>
        </li>
        <li class="breadcrumb-item">Register User</li>
      </ol>
      <h6 class="slim-pagetitle">Register User</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="section-wrapper">
      <form id="user-details-form">
        <div class="form-layout pd-l-10">
          <div class="row mg-b-25">
            <div class="col-lg-4">
              <div class="form-group">
                <label class="form-control-label">
                  First Name:
                  <span class="tx-danger">*</span>
                </label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="icon ion-ios-person tx-16 lh-0 op-6"></i>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="First Name" v-model="user.first_name"
                    name="first_name" required />
                </div>
                <!-- input-group -->
                <small class="tx-bold tx-danger" v-if="validationErrors.first_name"
                  v-text="validationErrors.first_name"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-4">
              <div class="form-group">
                <label class="form-control-label">
                  Last Name:
                  <span class="tx-danger">*</span>
                </label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="icon ion-ios-person tx-16 lh-0 op-6"></i>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="Last Name" v-model="user.last_name"
                    name="last_name" required />
                </div>
                <!-- input-group -->
                <small class="tx-bold tx-danger" v-if="validationErrors.last_name"
                  v-text="validationErrors.last_name"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-4">
              <div class="form-group">
                <label class="form-control-label">
                  Work Email:
                  <span class="tx-danger">*</span>
                </label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="icon ion-ios-email tx-16 lh-0 op-6"></i>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="Work Email" v-model="user.email" name="email"
                    required />
                </div>
                <!-- input-group -->
                <small class="tx-bold tx-danger" v-if="validationErrors.email" v-text="validationErrors.email"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-4">
              <div class="form-group">
                <label class="form-control-label">
                  Work Phone:
                  <span class="tx-danger">*</span>
                  <span v-if="user.phone_number" v-text="`+${user.country_code}(0)${user.phone_number}`"></span>
                </label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text dropdown-toggle cursor-pointer" aria-haspopup="true"
                      aria-expanded="false" @click="showPhoneCodes = !showPhoneCodes" @blur="showPhoneCodes = false">+{{
                      user.country_code }}</span>
                    <div class="dropdown-menu ht-200 wd-100p" :class="{ show: showPhoneCodes }">
                      <span class="dropdown-item cursor-pointer" v-for="country in countries" :key="country.alpha2Code"
                        @mousedown="
                          user.country_code = country.callingCodes[0];
                          showPhoneCodes = !showPhoneCodes;
                        ">{{ country.name.substring(0, 20) }} (+{{
                        country.callingCodes[0]
                        }})</span>
                    </div>
                  </div>
                  <input type="number" class="form-control" placeholder="Work Phone" v-model="user.phone_number"
                    name="phone_number" required />
                </div>
                <!-- input-group -->
                <small class="tx-bold tx-danger" v-if="validationErrors.phone_number"
                  v-text="validationErrors.phone_number"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-8">
              <div class="form-group">
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
                  <textarea type="text" class="form-control" placeholder="Address" v-model="user.address" name="address"
                    required></textarea>
                </div>
                <!-- input-group -->
                <small class="tx-bold tx-danger" v-if="validationErrors.address"
                  v-text="validationErrors.address"></small>
              </div>
            </div>
            <!-- col-8 -->
            <div class="col-lg-4">
              <div class="form-group mg-b-10-force">
                <label class="form-control-label">
                  Organization:
                  <span class="tx-danger">*</span>
                </label>
                <select class="form-control" name="organization_id" v-model="user.organization_id" required>
                  <option label="Choose Organization" :value="null">
                    Choose Organization
                  </option>
                  <option v-for="organization in organizations" :key="organization.id" :value="organization.id"
                    v-text="organization.name"></option>
                </select>
                <small class="tx-bold tx-danger" v-if="validationErrors.organization_id"
                  v-text="validationErrors.organization_id"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-4">
              <div class="form-group mg-b-10-force">
                <label class="form-control-label">Select Roles:</label>
                <v-select class="form-control" name="role_ids" label="name" placeholder="Pick Roles"
                  aria-multiselectable multiple selectOnTab :options="rolesByOrganization" :resetOnOptionsChange="true"
                  v-model="user.role_ids" :reduce="(role) => role.id"></v-select>
                <small class="tx-bold tx-danger" v-if="validationErrors.role_ids"
                  v-text="validationErrors.role_ids"></small>
              </div>
            </div>
            <!-- col-4 -->
            <div class="col-lg-4 form-group">
              <label class="form-control-label">Image (Max 2MB)</label>
              <div class="custom-file image-input">
                <input type="file" accept="image/*" @change="
                  convertToBase64($event).then((data) => {
                    user.image = data.file;
                    user.image_name = data.file_name;
                  })
                " class="custom-file-input" name="image" title="Select an image 1MB or less" />
                <label class="custom-file-label" for="customFile" v-text="user.image_name"></label>
              </div>
              <!-- custom-file -->
              <small class="tx-bold tx-danger" v-if="validationErrors.image" v-text="validationErrors.image"></small>
            </div>
          </div>
          <!-- row -->

          <div class="form-layout-footer tx-center">
            <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitUser()">SUBMIT</v-button>
          </div>
          <!-- form-layout-footer -->
        </div>
        <!-- form-layout -->
      </form>
    </div>
    <!-- section-wrapper -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";

export default {
  created() {
    this.getOrganizations(this);
    this.getCountries();
  },
  components: {
    vButton,
    vSelect
  },
  computed: {
    rolesByOrganization() {
      const organization = this.organizations.find(
        (organization) => organization.id == this.user.organization_id
      );
      if (!organization) return [];

      return organization.roles;
    }
  },
  data: () => ({
    countries: [],
    disabled: false,
    organizations: [],
    organizationAssociations: ["roles"],
    showPhoneCodes: false,
    user: {
      first_name: null,
      last_name: null,
      email: null,
      image: null,
      image_name: "Select Image",
      country_code: "234",
      phone_number: null,
      address: null,
      organization_id: null,
      role_ids: []
    },
    validationErrors: {}
  }),
  head: () => ({
    title: "Register User · Tsebo-Rapid"
  }),
  meta: {
    pageName: "users.store"
  },
  methods: {
    ...mapActions({
      getOrganizations: "onboarding/organizations/getOrganizations"
    }),
    async submitUser() {
      if (!this.validateForm("user-details-form")) return false;
      this.disabled = true;

      const name = `${this.user.first_name} ${this.user.last_name}`;
      const phone = `+${this.user.country_code}(0)${this.user.phone_number}`;

      try {
        const response = await this.$axios.post("users", {
          ...this.user,
          name,
          phone
        });
        this.disabled = false;
        this.$store.commit("people/users/setUser", response.data.user);
        this.$router.push(`/people/users/details?id=${response.data.user.id}`);
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
        }
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, onboardingMixin]
};
</script>
