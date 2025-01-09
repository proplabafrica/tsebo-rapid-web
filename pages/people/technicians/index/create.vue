<template>
  <form id="create-technician-form" class="bg-white pd-20">
    <fieldset :disabled="tradesLoading">
      <div class="row">
        <div class="form-group col-lg-4 col-md-6">
          <label class="fom-control-label">
            Name
            <span class="tx-danger">*</span>
          </label>
          <input type="text" v-model="technician.name" class="form-control" required name="name" placeholder="Name" />
          <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
        </div>
        <div class="form-group col-lg-4 col-md-6">
          <label class="fom-control-label">
            Phone
            <span class="tx-danger">*</span>
          </label>
          <input type="text" v-model="technician.phone" class="form-control" required placeholder="Phone"
            name="phone" />
          <small class="tx-bold tx-danger" v-text="validationErrors.phone"></small>
        </div>
        <div class="form-group col-lg-4 col-md-6">
          <label class="fom-control-label">
            Email
            <span class="tx-danger">*</span>
          </label>
          <input type="email" v-model="technician.email" class="form-control" required placeholder="Email"
            name="email" />
          <small class="tx-bold tx-danger" v-text="validationErrors.email"></small>
        </div>
        <div class="col-lg-3 form-group">
          <label class="form-control-label">Image (Max 2MB)</label>
          <div class="custom-file image-input">
            <input type="file" accept="image/*" @change="
              convertToBase64($event).then((data) => {
                technician.image = data.file;
                technician.image_name = data.file_name;
              })
            " class="custom-file-input" name="image" title="Select an image 1MB or less" />
            <label class="custom-file-label" for="customFile" v-text="technician.image_name"></label>
          </div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.image" v-text="validationErrors.image"></small>
        </div>
        <div class="form-group col-md-5">
          <label class="fom-control-label">
            Address
            <span class="tx-danger">*</span>
          </label>
          <textarea name="address" class="form-control" v-model="technician.address" placeholder="Address"
            required></textarea>
          <small class="tx-bold tx-danger" v-text="validationErrors.address"></small>
        </div>
        <div class="form-group col-lg-4 col-md-6">
          <label class="fom-control-label">
            Trades
            <span class="tx-danger">*</span>
          </label>
          <v-select class="form-control" label="name" placeholder="Pick Trades" aria-multiselectable multiple
            selectOnTab :options="trades" v-model="technician.trade_ids" :reduce="(trade) => trade.id"></v-select>
        </div>
      </div>
      <div class="tx-center form-layout-footer">
        <v-button :disabled="disabled" @click="submitTechnician()" class="btn btn-primary">SUBMIT</v-button>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  technician: {
    address: "",
    name: "",
    email: "",
    phone: "",
    trade_ids: [],
    image: null,
    image_name: "Select an image"
  },
  trades: [],
  tradesLoading: true,
  validationErrors: {}
});

export default {
  created() {
    this.getTrades(this);
  },
  components: { vButton, vSelect },
  data: () => getInitialData(),
  head: () => ({
    title: "Create Technician · Tsebo-Rapid"
  }),
  meta: {
    pageName: "technicians.store"
  },
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades"
    }),
    async submitTechnician() {
      if (!this.validateForm("create-technician-form")) return false;
      this.disabled = true;

      try {
        const response = await this.$axios.post("technicians", this.technician);
        this.disabled = false;
        this.$store.commit(
          "people/technicians/setTechnician",
          response.data.technician
        );
        this.$store.commit("people/technicians/toggleRefresh");

        const { tradesLoading, trades } = this;
        var initialData = Object.assign(getInitialData(), {
          tradesLoading,
          trades
        });
        Object.assign(this.$data, initialData);
        this.toast({ type: "success", title: "Technician registered" });
      } catch (error) {
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Technician registeration failed"
        });
        console.log(error);
        const response = error.response;
        if (!response) return;
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
  mixins: [authMixin, formMixin]
};
</script>
