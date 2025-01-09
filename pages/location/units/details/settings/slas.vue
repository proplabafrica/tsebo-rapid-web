<template>
  <div class="row mg-t-10 mg-x-0">
    <div class="col-md-4 pd-l-0 pd-r-5">
      <div class="card card-body">
        <h6 class="slim-card-title mg-b-20">Create SLA</h6>
        <form id="create-sla-form">
          <div class="form-group">
            <label for="name" class="form-control-label">
              Parent SLA
              <span class="tx-danger">*</span>
            </label>
            <select name="parent_sla_id" class="form-control" v-model="newSla.parent_sla_id">
              <option :value="null">Select One</option>
              <option v-for="sla in organizationSlas" :key="sla.id" :value="sla.id">
                {{ sla.name }}
              </option>
            </select>
            <small class="tx-bold tx-danger" v-text="validationErrors.parent_sla_id"></small>
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

            <small class="tx-bold tx-danger" v-if="validationErrors.expected_time"
              v-text="validationErrors.expected_time"></small>
            <small class="tx-bold tx-danger float-right" v-if="validationErrors.expected_time_measurement"
              v-text="validationErrors.expected_time_measurement"></small>
          </div>
          <div class="form-layout-footer tx-center">
            <v-button class="btn btn-primary bd-0" @click="submitSla()" :disabled="disabled">SUBMIT</v-button>
          </div>
        </form>
      </div>
    </div>
    <div class="col pd-r-0 pd-l-5">
      <v-paginate :list="unitSlas" perPage="60" v-if="!slasLoading">
        <template v-slot="paginate">
          <div class="row mg-0" v-if="paginate.list.length > 0">
            <div class="col-md-6 pd-md-0" v-for="sla in paginate.list" :key="sla.id">
              <ul class="list-group">
                <li class="list-group-item ht-100">
                  <p class="mg-b-0">
                    <edit-sla v-if="!systemEntitiesLoading && !slaPrioritiesLoading" :sla="sla"
                      :systemEntities="systemEntities" :slaPriorities="slaPriorities" :trades="trades" @updated="updateList()" />
                    <nuxt-link class="tx-inverse" :to="`/performance/slas/details?id=${sla.id}`">
                      <strong class="tx-medium" v-text="sla.name"></strong>
                    </nuxt-link>
                    <span class="d-block" v-if="sla.measurement">{{ sla.expected_time }} {{ sla.measurement.name
                    }}</span>
                    <span class="d-block">{{ sla.entity.name }}</span>
                    <span class="tx-11 d-block">
                      <span class="square-8 mg-r-5 rounded-circle"
                        :class="[`bg-${priorityClasses[sla.priority.code]}`]"></span>
                      <span>{{ sla.priority.name }}</span>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
            <!-- col-4 -->
          </div>
          <h4 v-else>No data to display</h4>
          <!-- row -->
        </template>
        <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      </v-paginate>
      <loading v-else />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  computed: {
    organizationSlas() {
      return this.slas.filter((sla) => sla.parent_sla_id == null);
    },
    unitSlas() {
      return this.slas.filter((sla) => sla.unit_id == this.unit.id);
    }
  },
  components: {
    "edit-sla": () => import("@/components/performance/slas/edit"),
    loading,
    vButton,
    vPaginate
  },
  created() {
    this.getSlas(this);
    this.getSlaPriorities(this);
    this.getSystemEntities(this);
       this.getTrades(this);

  },
  data: () => ({
    disabled: false,
    newSla: {
      parent_sla_id: null,
      expected_time: null,
      expected_time_measurement: null,
         trade_code: null

    },
    slas: [],
    slasLoading: true,
     trades: [],
    tradesLoading: true,

    slaPriorities: [],
    systemEntities: [],
    systemEntitiesLoading: true,
    slaPrioritiesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "SLAs · Unit Settings · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    ...mapActions({
      getSlas: "performance/slas/getSlas",
         getTrades: "people/trades/getTrades",

      getSystemEntities: "console/systemEntities/getSystemEntities",
      getSlaPriorities: "performance/slaPriorities/getSlaPriorities"
    }),
    async submitSla() {
      if (!this.validateForm("create-sla-form")) return;
      this.disabled = true;

      try {
        const parentSla = this.organizationSlas.find(
          (sla) => sla.id == this.newSla.parent_sla_id
        );
        const name = `${parentSla.name} (${this.unit.name})`;
        const unit_id = this.unit.id;

        const response = await this.$axios.post("slas", {
          ...this.newSla,
          name,
          system_entity_code: parentSla.entity.code,
          sla_priority_code: parentSla.priority.code,
          unit_id
        });
        this.$store.commit("performance/slas/toggleRefresh");
        this.disabled = false;
        this.newSla = {
          parent_sla_id: null,
          expected_time: null,
          expected_time_measurement: null
        };
        this.getSlas(this);
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
    },
    updateList() {
      this.getSlas(this);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin],
  props: ["unit"]
};
</script>
