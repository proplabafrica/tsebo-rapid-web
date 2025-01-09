<template>
  <div class="d-inline">
    <span v-modal-open="'create-role-modal'" class="btn btn-contact-new">ADD ROLE</span>
    <v-modal ref="create-role-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'create-role-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="slim-card-title">CREATE ROLE</div>
            <form id="create-role-form">
              <div class="form-layout">
                <div class="form-group">
                  <label for class="form-control-label">
                    Name
                    <span class="tx-danger">*</span>
                  </label>
                  <input type="text" name="name" class="form-control" v-model="role.name" required placeholder="Name" />
                  <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
                </div>
                <div class="form-group">
                  <label for="name">
                    Code
                    <span class="tx-danger">*</span>
                  </label>
                  <select name="country_code" class="form-control" required v-model="role.code">
                    <option :value="null">Select a Code</option>
                    <option v-for="code in roleCodes" :key="`role-code-${code}`" :value="code" v-text="code"></option>
                  </select>
                  <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
                </div>
                <div class="form-group">
                  <label for class="form-control-label">Description</label>
                  <textarea type="text" name="name" class="form-control" v-model="role.description" required>
Description</textarea>
                  <small class="tx-danger tx-bold" v-if="validationErrors.description"
                    v-text="validationErrors.description"></small>
                </div>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="submitRole()">
                  <i class="icon ion-ios-checkmark-outline"></i> SUBMIT
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'create-role-modal'"
                  aria-label="Close" :disabled="disabled">
                  <i class="icon ion-ios-close-outline"></i> CANCEL
                </button>
              </div>
            </form>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </div>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  data: () => ({
    disabled: false,
    role: {
      name: null,
      code: null,
      description: null
    },
    roleCodes: ["FM", "OA", "OCC", "PM", "PO", "SYS", "TCHN", "VND"],
    validationErrors: {}
  }),
  methods: {
    async submitRole() {
      if (!this.validateForm("create-role-form")) return false;
      this.disabled = true;
      const vm = this;

      try {
        const response = await this.$axios.post("roles", {
          ...this.role,
          organization_id: vm.organization.id
        });
        this.disabled = false;
        this.role = {
          name: null,
          code: null,
          description: null
        };
        this.toast({ type: "info", title: "Role Created" });
        this.$emit("update");
        this.closeModal("create-role-modal");
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
  mixins: [formMixin, modalMixin],
  props: ["organization"]
};
</script>
