<template>
  <div class="row mg-t-10" v-if="!servicesLoading">
    <div class="col-md-3">
      <div class="card card-body pd-25">

        <h6 class="slim-card-title mg-b-20">Create Service</h6>
        <form id="create-service-form">
          <div class="form-group">
            <label for="name" class="form-control-label">
              Name
              <span class="tx-danger">*</span>
            </label>
            <input type="text" class="form-control" name="name" v-model="service.name" required
              placeholder="Service Name" />
            <small class="tx-bold tx-danger" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
          <div class="form-group">
            <label for="cost" class="form-control-label">
              Service Cost
              <span class="tx-danger">*</span>
              <span>({{ { value: service.cost } | toMoney }})</span>
            </label>
            <input type="number" step="any" class="form-control" name="cost" v-model="service.cost" required
              placeholder="Service Cost" />
            <small class="tx-bold tx-danger" v-if="validationErrors.cost" v-text="validationErrors.cost"></small>
          </div>
          <div class="form-group">
            <label for="trades" class="form-control-label">Trades</label>
            <v-select class="form-control" name="trades" label="name" placeholder="Pick Trades" aria-multiselectable
              multiple selectOnTab :options="trades" v-model="service.trades" :disabled="tradesLoading"></v-select>
          </div>
          <v-button :disabled="disabled" @click="submitService()" class="btn btn-primary btn-block">SUBMIT</v-button>
        </form>
      </div>
      <!-- card -->
    </div>
    <!-- <h4>{{services}}</h4> -->
    <v-paginate class="col mg-t-10 mg-md-0" :list="services" perPage="30">
      <template v-slot="paginate">
        <div class="row" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="service in paginate.list" :key="service.id">
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <div class="d-flex justify-content-between">
                  <p class="mg-b-0">
                    <nuxt-link :to="`/hagul/inventory/services/details?id=${service.id}`"
                      class="tx-inverse tx-14 tx-medium d-block" v-text="service.name"></nuxt-link>
                    <span class="d-block">{{
                    { value: service.cost, currency: service.currency }
                    | toMoney
                    }}</span>
                    <span class="tx-11 d-block" v-if="service.trades.length > 0">
                      Trades:
                      <span v-for="(trade, index) in service.trades" :key="trade.id">{{ trade.name
                      }}{{
                        index + 1 >= service.trades.length ? "" : ", "
                        }}</span>
                    </span>
                  </p>
                  <div>
                    <span>
                      <edit-service :service="service" :trades="trades" @updated="updateList()" />
                    </span>
                    <span v-modal-open="'delete-modal'" @click="serviceToDelete = service">
                      <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
        <h4 v-else>No data to display</h4>
        <v-modal ref="delete-modal">
          <div class="modal-dialog wd-300 wd-sm-400" role="document">
            <div class="modal-content tx-size-sm">
              <div class="modal-body tx-center pd-y-20 pd-x-20">
                <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 style="font-size: 16px" class="mg-b-20">
                  Are you sure you want to delete
                  <span v-text="serviceToDelete.name"></span>
                </h4>
                <div class="form-layout-footer">
                  <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                    @click="deleteService()">
                    <i class="icon ion-ios-checkmark-outline"></i>
                    Confirm
                  </v-button>
                  <button style="border-radius: 8px" type="button" class="btn btn-danger pd-x-4"
                    v-modal-close="'delete-modal'" aria-label="Close" :disabled="disabled">
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
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <!-- v-paginate -->
  </div>
  <loading v-else />
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  service: {
    name: null,
    cost: null,
    trades: []
  },
  services: [],
  serviceToDelete: [],
  servicesLoading: true,
  trades: [],
  tradesLoading: false,
  validationErrors: {}
});

export default {
  components: {
    "edit-service": () => import("@/components/hagul/inventory/services/edit"),
    loading,
    vButton,
    vPaginate,
    vSelect,
    vModal
  },
  created() {
    this.getServices(this);
    this.getTrades(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Services · Hagul"
  }),
  meta: {
    pageName: "services.store"
  },
  methods: {
    async deleteService() {
      let service = this.serviceToDelete;
      const { trades } = service;
      const trade_ids = trades.map(trade => trade.id);
      try {
        const response = await this.$axios.delete(`services/${service.id}`, {
          trade_ids
        });
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Service Deleted"
        });
        this.$router.go();
        this.$store.commit("hagul/inventory/services/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Service"
        });
      }
    },
    ...mapActions({
      getServices: "hagul/inventory/services/getServices",
      getTrades: "people/trades/getTrades"
    }),
    async submitService() {
      if (!this.validateForm("create-service-form")) return false;
      this.disabled = true;

      try {
        this.service.trade_ids = this.service.trades.map(trade => trade.id);
        const response = await this.$axios.post("services", {
          ...this.service
        });
        this.disabled = false;
        this.$store.commit("hagul/inventory/services/toggleRefresh");
        var { trades, tradesLoading } = this;
        var initialData = Object.assign(getInitialData(), {
          trades,
          tradesLoading
        });
        Object.assign(this.$data, initialData);
        this.getServices(this);
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    },
    updateList() {
      this.getServices(this);
    }
  },
  mixins: [formMixin, modalMixin],
  middleware: ["auth", "roleGuard"]
};
</script>
