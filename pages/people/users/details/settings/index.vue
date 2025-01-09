<template>
  <div class="section-wrapper" v-if="editedUser">
    <div class="form-layout">
      <form id="edit-user-form">
        <div class="row mg-b-25">
          <div class="col-lg-4">
            <div class="form-group">
              <label class="form-control-label">
                Fullname:
                <span class="tx-danger">*</span>
              </label>
              <input name="name" type="text" class="form-control" v-model="editedUser.name" placeholder="Name"
                required />
              <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
            </div>
          </div>
          <!-- col-4 -->

          <div class="col-lg-4">
            <div class="form-group">
              <label class="form-control-label">
                Email address:
                <span class="tx-danger">*</span>
              </label>
              <input name="email" type="email" class="form-control" v-model="editedUser.email"
                placeholder="Email Address" required />
              <small class="tx-danger tx-bold" v-if="validationErrors.email" v-text="validationErrors.email"></small>
            </div>
          </div>
          <!-- col-4 -->

          <div class="col-lg-4">
            <div class="form-group">
              <label class="form-control-label">
                Phone:
                <span class="tx-danger">*</span>
              </label>
              <input name="phone" type="text" class="form-control" v-model="editedUser.phone" placeholder="Phone"
                required />
              <small class="tx-danger tx-bold" v-if="validationErrors.phone" v-text="validationErrors.phone"></small>
            </div>
          </div>
          <!-- col-4 -->

          <div class="col-lg-8">
            <div class="form-group mg-b-10-force">
              <label class="form-control-label">
                Address:
                <span class="tx-danger">*</span>
              </label>
              <input name="address" type="text" class="form-control" v-model="editedUser.address" placeholder="Address"
                required />
              <small class="tx-danger tx-bold" v-if="validationErrors.address"
                v-text="validationErrors.address"></small>
            </div>
          </div>
          <!-- col-8 -->

          <div class="col-lg-4 form-group">
            <label class="form-control-label">Image</label>
            <div class="custom-file image-input">
              <input type="file" accept="image/*" @change="
                convertToBase64($event).then((data) => {
                  editedUser.image = data.file;
                  editedUser.image_name = data.file_name;
                })
              " class="custom-file-input" name="image" title="Select an image 1MB or less" />
              <label class="custom-file-label" for="customFile" v-text="editedUser.image_name"></label>
            </div>
            <!-- custom-file -->
            <small class="tx-bold tx-danger" v-if="validationErrors.image" v-text="validationErrors.image"></small>
          </div>

          <div class="form-group col-12">
            <label class="form-control-label">
              Roles
              <span class="tx-danger">*</span>
            </label>
            <div class="row" v-if="!rolesLoading">
              <div class="col-lg-4" v-for="role in roles" :key="role.id">
                <label class="ckbox">
                  <input type="checkbox" :value="role.id" v-model="editedUser.role_ids" />
                  <span v-text="role.name"></span>
                </label>
              </div>
              <!-- col-4 -->
            </div>
            <!-- row -->
            <loading v-else />
          </div>
        </div>
        <!-- row -->

        <div class="form-layout-footer tx-center" v-if="editedUser.role_ids.length > 0">
          <v-button :disabled="disabled" @click="updateUser()" class="btn btn-primary bd-0">UPDATE</v-button>
        </div>
        <!-- form-layout-footer -->
      </form>
    </div>
    <!-- form-layout -->
  </div>
  <!-- section-wrapper -->
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
    this.setEditedUser();
    this.getRoles({
      byOrganizationIds: this.user.organizations.map((org) => org.id)
    });
  },
  data: () => ({
    disabled: false,
    editedUser: null,
    roles: [],
    rolesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Edit User · Tsebo-Rapid"
  }),
  methods: {
    setEditedUser() {
      const { name, email, phone, addresses } = this.user;
      const address = addresses[0] ? addresses[0].address : null;
      const role_ids = this.user.roles.map((role) => role.id);
      const image = null,
        image_name = "Select Picture";
      this.editedUser = {
        name,
        email,
        phone,
        address,
        role_ids,
        image,
        image_name
      };
    },
    async updateUser() {
      if (!this.validateForm("edit-user-form")) return false;
      this.disabled = true;

      try {
        await this.$axios.put("users/" + this.user.id, this.editedUser);
        this.disabled = false;
        this.$emit("update");
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
  middleware: ["auth"],
  mixins: [authMixin, formMixin, onboardingMixin],
  props: ["user"]
};
</script>
