<template>
  <div class="row mg-t-10 mg-x-0">
    <div style="width: 100%">
      <input type="text" placeholder="Start typing here to search"
        class="form-control wd-200 mg-t-5 mg-b-10 mg-x-0 float-left" v-model="slaSearch" />
    </div>
    <div class="col-md-3 pd-l-0 pd-r-5">
      <div class="card card-body">
        <h6 class="slim-card-title mg-b-20">Create SLA</h6>
        <form id="create-sla-form">
          <div class="form-group">
            <label for="name" class="form-control-label">
              Name
              <span class="tx-danger">*</span>
            </label>
            <input type="text" name="name" v-model="newSla.name" class="form-control" placeholder="Name"
              maxlength="60" />
            <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
          </div>
          <div class="form-group">
            <label for="expected_time" class="form-control-label">
              Expected Time
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <input type="number" name="expected_time" placeholder="Expected Time" class="form-control"
                v-model="newSla.expected_time" required />
              <select name="expected_time_measurement" v-model="newSla.expected_time_measurement" class="form-control"
                required>
                <option :value="null">Select Unit</option>
                <option v-for="measurement in ['hours', 'days', 'weeks']" :key="measurement" :value="measurement"
                  v-text="measurement"></option>
              </select>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.expected_time"
              v-text="validationErrors.expected_time"></small>
            <small class="tx-bold tx-danger float-right" v-if="validationErrors.expected_time_measurement"
              v-text="validationErrors.expected_time_measurement"></small>
          </div>
          <div class="form-group" v-if="false">
            <label for="system_entity_code" class="form-control-label">
              Entity
              <span class="text-danger">*</span>
            </label>
            <select name="system_entity_code" v-model="newSla.system_entity_code" class="form-control" required>
              <option :value="null">Select One</option>
              <option v-for="entity in systemEntities" :key="entity.id" :value="entity.code" v-text="entity.name">
              </option>
            </select>
            <small class="tx-bold tx-danger" v-text="validationErrors.system_entity_code"></small>
          </div>
          <div class="form-group">
            <label for="sla_priority_code" class="form-control-label">
              Priority
              <span class="text-danger">*</span>
            </label>
            <select name="sla_priority_code" v-model="newSla.sla_priority_code" class="form-control" required>
              <option :value="null">Select One</option>
              <option v-for="priority in slaPriorities" :key="priority.id" :value="priority.code"
                v-text="priority.name"></option>
            </select>
            <small class="tx-bold tx-danger" v-text="validationErrors.sla_priority_code"></small>
          </div>
          <div class="form-group">
            <label for="trade_code" class="form-control-label">
              Trade
              <span class="text-danger">*</span>
            </label>
            <select name="trade_code" v-model="newSla.trade_code" class="form-control" required>
              <option :value="null">Select One</option>
              <option v-for="trade in trades" :key="trade.id" :value="trade.code" v-text="trade.name"></option>
            </select>
            <small class="tx-bold tx-danger" v-text="validationErrors.trade_code"></small>
          </div>
          <div class="form-layout-footer tx-center">
            <v-button class="btn btn-primary bd-0" @click="submitSla()" :disabled="disabled">SUBMIT</v-button>
          </div>
        </form>
      </div>
    </div>
    <div class="col pd-r-0 pd-l-5">
      <v-paginate :list="slas" perPage="60" v-if="!slasLoading">
        <template v-slot="paginate">
          <div class="row mg-0" v-if="paginate.list.length > 0">
            <div class="col-md-6 col-lg-4 pd-md-0" v-for="sla in paginate.list" :key="sla.id">
              <ul class="list-group">
                <li class="list-group-item ht-120">
                  <div class="mg-b-0 d-flex justify-content-between">
                    <div>
                      <nuxt-link class="tx-inverse" :to="`/performance/slas`">
                        <strong class="tx-medium" v-text="sla.name"></strong>
                      </nuxt-link>
                      <span class="d-block" v-if="sla.measurement">{{ sla.expected_time }}
                        {{ sla.measurement.name }}</span>
                      <span class="d-block">
                        {{ sla.entity.name }}
                        <span v-if="sla.trade">({{ sla.trade.name }})</span>
                      </span>
                      <span class="tx-11 d-block">
                        <span class="square-8 mg-r-5 rounded-circle"
                          :class="[`bg-${priorityClasses[sla.priority.code]}`]"></span>
                        <span>{{ sla.priority.name }}</span>
                      </span>
                    </div>
                    <div>
                      <edit-sla class="pd-b-80" v-if="!systemEntitiesLoading && !slaPrioritiesLoading" :sla="sla"
                        :systemEntities="systemEntities" :slaPriorities="slaPriorities" :trades="trades"
                        @updated="updateList()" />
                      <span v-modal-open="'delete-modal'" @click="slaToDelete = sla">
                        <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- col-4 -->
          </div>
          <h4 v-else>No data to display</h4>
          <!-- row -->
          <v-modal ref="delete-modal">
            <div class="modal-dialog wd-300 wd-sm-400" role="document">
              <div class="modal-content tx-size-sm">
                <div class="modal-body tx-center pd-y-20 pd-x-20">
                  <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 style="font-size: 16px" class="mg-b-20">
                    Are you sure you want to delete this SLA?
                  </h4>
                  <div class="form-layout-footer">
                    <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4"
                      :disabled="disabled" @click="deleteSla()">
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
      <loading v-else />
    </div>
  </div>
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: {
    "edit-sla": () => import("@/components/performance/slas/edit"),
    loading,
    vButton,
    vPaginate,
    vModal
  },
  created() {
    this.getSlas(this);
    this.getSlaPriorities(this);
    this.getSystemEntities(this);
    this.getTrades(this);
  },
  data: () => ({
    disabled: false,
    slaToDelete: [],
    newSla: {
      name: null,
      expected_time: null,
      expected_time_measurement: null,
      system_entity_code: "WKR",
      sla_priority_code: null,
      trade_code: null
    },
    slas: [],
    slasLoading: true,
    systemEntities: [],
    systemEntitiesLoading: true,
    slaSearch: null,
    slaPriorities: [],
    slaPrioritiesLoading: true,
    trades: [],
    tradesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "SLAs · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    async deleteSla() {
      let sla = this.slaToDelete;
      this.disabled = true;
      try {
        const response = await this.$axios.delete(`slas/${sla.id}`, {});
        this.disabled = false;
        this.toast({ type: "info", title: "SLA Deleted" });
        this.$router.go();
        this.$store.commit("performance/slas/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete SLA"
        });
      }
    },
    ...mapActions({
      getSlas: "performance/slas/getSlas",
      getSystemEntities: "console/systemEntities/getSystemEntities",
      getSlaPriorities: "performance/slaPriorities/getSlaPriorities",
      getTrades: "people/trades/getTrades"
    }),
    async submitSla() {
      if (!this.validateForm("create-sla-form")) return;
      this.disabled = true;

      try {
        const response = await this.$axios.post("slas", { ...this.newSla });
        this.$store.commit("performance/slas/toggleRefresh");
        this.disabled = false;
        this.newSla = {
          name: null,
          expected_time: null,
          expected_time_measurement: null,
          system_entity_code: null,
          sla_priority_code: null,
          trade_code: null
        };
        this.getSlas(this);
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
        } else {
        }
      }
    },
    updateList() {
      this.getSlas(this);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    slaSearch(search) {
      this.debounce(() => {
        this.slasLoading = true;
        this.getSlas(this);
      }, 300);
    }
  }
};
</script>
