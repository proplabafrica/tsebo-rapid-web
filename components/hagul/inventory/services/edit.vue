<template>
  <div>
    <i class="icon ion-android-create tx-16 tx-info cursor-pointer float-right" v-modal-open="'edit-service-modal'"></i>
    <v-modal ref="edit-service-modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'edit-service-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h6 class="slim-card-title mg-b-20">Edit Service</h6>
            <form id="edit-service-form">
              <div class="form-group">
                <label for="name" class="form-control-label">
                  Name
                  <span class="tx-danger">*</span>
                </label>
                <input type="text" name="name" v-model="editedService.name" class="form-control"
                  placeholder="Service Name" />
                <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
              </div>
              <div class="form-group">
                <label for="expected_time" class="form-control-label">
                  Service Cost

                  <span class="tx-danger">*</span>
                  <span>({{ { value: editedService.cost } | toMoney }})</span>
                </label>
                <div class="input-group">
                  <input type="number" name="cost" placeholder="Service Cost" class="form-control"
                    v-model="editedService.cost" required />
                  <small class="tx-bold tx-danger" v-if="validationErrors.cost" v-text="validationErrors.cost"></small>
                </div>
              </div>
              <div class="form-group">
                <label for="trades" class="form-control-label">Trades</label>
                <v-select class="form-control" name="trades" label="name" placeholder="Pick Trades" aria-multiselectable
                  multiple selectOnTab :options="trades" v-model="service.trades">
                </v-select>
              </div>
              <div class="form-layout-footer tx-center">
                <v-button class="btn btn-primary bd-0" @click="updateService()" :disabled="disabled">UPDATE</v-button>
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
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: { vButton, vModal, vSelect },
  async created() {
    this.setEditedService();
  },
  data: () => ({
    disabled: false,
    editedService: {
      name: null,
      cost: null,
      trades: []
    },
    validationErrors: {}
  }),
  methods: {
    setEditedService() {
      const { name, cost, trades } = this.service;

      this.editedService = Object.assign(
        {},
        {
          name,
          cost,
          trades
        }
      );
    },
    async updateService() {
      if (!this.validateForm("edit-service-form")) return false;
      this.disabled = true;
      try {
        const response = await this.$axios.put(
          `services/${this.service.id}`,
          this.editedService
        );

        this.disabled = false;
        this.$store.commit("hagul/inventory/services/toggleRefresh");
        this.$emit("updated", this);
        this.closeModal("edit-service-modal");
        this.toast({ title: "Service updated", type: "success" });
      } catch (error) {
        this.disabled = false;
        console.log(error);
        this.toast({ title: "Could not update Service", type: "danger" });
        const response = error.response;
        if (!response) return false;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {
          // response);
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["service", "trades"]
};
</script>
