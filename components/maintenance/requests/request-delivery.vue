<template>
  <div class="mg-b-5">
    <span v-modal-open="'request-delivery-modal'" class="btn btn-primary bd-0">
      <i class="icon ion-android-clipboard tx-14"></i> Request Delivery
    </span>
    <v-modal ref="request-delivery-modal">
      <div class="modal-dialog modal-lg wd-700" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'request-delivery-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div v-if="scoped">
              <h5 class="mg-b-20">Review Items</h5>
              <div class="table-responsive tx-left">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tr v-for="item in workRequest.items" :key="item.id">
                    <td
                      v-if="
                        item.deliveryType.code == 'material' && item.material
                      "
                    >
                      <span
                        v-text="item.deliveryType.name"
                        class="d-block"
                      ></span>
                      <nuxt-link
                        :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
                        class="tx-inverse tx-14 tx-medium d-block"
                        v-text="item.material.name"
                      ></nuxt-link>
                      <span v-if="item.material.code" class="tx-11 d-block"
                        >#{{ item.material.code }}</span
                      >
                      <span class="tx-11 d-block"
                        >Stock: {{ item.material.stock }}</span
                      >
                    </td>
                    <td v-if="item.deliveryType.code == 'service'">
                      <span
                        v-text="item.deliveryType.name"
                        class="d-block"
                      ></span>
                      <nuxt-link
                        :to="`/hagul/inventory/services/details?id=${item.service.id}`"
                        class="tx-inverse tx-14 tx-medium d-block"
                        v-text="item.service.name"
                      ></nuxt-link>
                    </td>
                    <td>
                      <span v-text="item.quantity"></span>
                    </td>
                  </tr>
                </table>
              </div>
              <!-- table-responsive -->
            </div>
            <h3 class="mg-b-20" v-else>
              {{
                `Request Delvery for ${workRequest.name}. Confirm to review materials`
              }}
            </h3>
            <div class="form-layout-footer tx-center mg-t-20">
              <v-button
                v-if="!scoped"
                class="btn btn-primary bd-0"
                :disabled="disabled"
                @click="scopeAndRequestDelivery()"
              >
                <i class="icon ion-ios-checkmark-outline"></i> Confirm
              </v-button>
              <v-button
                v-else
                class="btn btn-primary bd-0"
                :disabled="disabled"
                @click="requestDelivery()"
              >
                <i class="icon ion-ios-checkmark-outline"></i> Confirm
              </v-button>
              <button
                type="button"
                class="btn btn-danger pd-x-25"
                v-modal-close="'request-delivery-modal'"
                aria-label="Close"
                :disabled="disabled"
              >
                <i class="icon ion-ios-close-outline"></i> Cancel
              </button>
            </div>
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
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, vButton, vModal },
  data: () => ({
    disabled: false,
    scoped: false
  }),
  created() {
    this.editedWorkRequest = this.$root.$refs.scopeJob?.$data?.editedWorkRequest;
  },
  methods: {
    async getWorkRequest() {
      const response = await this.$axios.get(
        `work-requests/${this.workRequest.id}`,
        {
          params: {
            associations: [
              "equipment",
              "items",
              "items.deliveryType",
              "items.material",
              "items.materialCost",
              "items.service",
              "items.serviceCost"
            ]
          }
        }
      );
      this.workRequest = response.data.workRequest;
    },
    async scopeAndRequestDelivery() {
      await this.submitJobScope();
      await this.getWorkRequest();
    },
    async submitJobScope() {
      this.disabled = true;
      this.scoped = false;
      this.editedWorkRequest =
        this.$root.$refs.scopeJob.$data.editedWorkRequest;
      const {
        description,
        failure_type_id,
        items,
        sla_id,
        outsourced,
        technicians,
        trade,
        equipment,
        expected_time,
        expected_time_measurement
      } = this.editedWorkRequest;
      const technician_ids = technicians.map((technician) => technician.id);
      const equipment_ids = equipment.map((equipment) => equipment.id);
      const trade_ids = [trade.id];
      const work_request_id = this.workRequest.id;
      const delivery_type_id = items.map((item) => item.deliveryType.id);
      const item_id = items.map((item) =>
        item[item.deliveryType.code] ? item[item.deliveryType.code].id : null
      );
      const item_name = items.map((item) =>
        item[item.deliveryType.code] ? item[item.deliveryType.code].name : null
      );
      const quantity = items.map((item) =>
        item.quantity ? item.quantity : null
      );
      try {
        const response = await this.$axios.post("work-requests/job-scoping", {
          delivery_type_id,
          description,
          failure_type_id,
          item_id,
          item_name,
          sla_id,
          outsourced,
          quantity,
          technician_ids,
          trade_ids,
          work_request_id,
          equipment_ids,
          expected_time,
          expected_time_measurement
        });
        this.disabled = false;
        this.scoped = true;
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {}
      }
    },
    requestDelivery() {
      this.disabled = true;
      this.scoped = true;
      const work_request_id = this.workRequest.id;
      this.$axios
        .post("work-requests/request-delivery", { work_request_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("request-delivery-modal");
          this.$emit("update");
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    }
  },
  mounted() {
    this.editedWorkRequest = this.$root.$refs.scopeJob?.$data?.editedWorkRequest;
  },
  mixins: [modalMixin],
  props: ["workRequest"]
};
</script>
