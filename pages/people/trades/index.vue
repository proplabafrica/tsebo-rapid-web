<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Trades</li>
      </ol>
      <h6 class="slim-pagetitle">Trades</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row mg-t-10" v-if="!tradesLoading">
      <div class="col-md-3">
        <div class="card card-body pd-25">
          <h6 class="slim-card-title mg-b-20">Create Trades</h6>
          <form id="create-categories-form" class="row">
            <div class="col-12" v-for="(trade, index) in newTradesArray" :key="`trade-${index}`">
              <div class="form-group">
                <div class="input-group">
                  <input :name="'name' + index" v-model="newTrades[index].name" class="form-control" required
                    placeholder="Trade Name" />
                  <div class="input-group-append cursor-pointer" v-if="index != 0" @click="deleteTrade(index)">
                    <span class="input-group-text bg-danger tx-white">
                      <i class="icon ion-trash-a tx-16 lh-0"></i>
                    </span>
                  </div>
                  <div class="input-group-append cursor-pointer" @click="add1Trade()">
                    <span class="input-group-text">+</span>
                  </div>
                </div>
                <small class="tx-bold tx-danger" v-text="validationErrors['name' + index]"></small>
              </div>
            </div>
          </form>
          <v-button :disabled="disabled" @click="submitTrades()" class="btn btn-primary btn-block">SUBMIT</v-button>
        </div>
        <!-- card -->
      </div>

      <div class="section-wrapper col">
        <v-paginate class="mg-t-10 mg-md-0" :list="trades" perPage="30">
          <template v-slot="paginate">
            <div class="row" v-if="paginate.list.length > 0">
              <div class="col-md-6 col-lg-4 pd-md-0" v-for="trade in paginate.list" :key="trade.id">
                <ul class="list-group">
                  <li class="list-group-item">
                    <p class="mg-b-0">
                      <strong class="tx-inverse tx-medium" v-text="trade.name"></strong>
                      <span v-modal-open="'delete-modal'" @click="tradeToDelete = trade">
                        <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer float-right"></i>
                      </span>
                    </p>
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
                      <span v-text="tradeToDelete.name"></span>
                    </h4>
                    <div class="form-layout-footer">
                      <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4"
                        :disabled="disabled" @click="deleteTradeApi()">
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
      <!-- section-wrapper -->
    </div>
    <loading v-else />
  </div>
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vPaginate, vModal },
  created() {
    this.add1Trade();
    this.getTrades();
  },
  data: () => ({
    disabled: false,
    tradeToDelete: [],
    newTrades: [],
    trades: [],
    newTradesArray: [],
    tradesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Trades · Tsebo-Rapid"
  }),
  meta: {
    pageName: "trades.index"
  },
  methods: {
    async deleteTradeApi() {
      let trade = this.tradeToDelete;
      this.disabled = true;
      try {
        const response = await this.$axios.delete(`trades/${trade.id}`, {});
        this.disabled = false;
        this.$router.go();
        this.$store.commit("people/trades/toggleRefresh");
        this.toast({ type: "info", title: "Trade Deleted" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Trade"
        });
      }
    },
    add1Trade() {
      this.newTradesArray.push({});
      this.newTrades.push({ name: "" });
      this.validationErrors["name" + (this.trades.length - 1)] = null;
    },
    deleteTrade(index) {
      this.newTradesArray.splice(index, 1);
      this.newTrades.splice(index, 1);
      delete this.validationErrors["name" + index];
    },
    getTrades() {
      var {
        associations,
        pagination,
        trades,
        refresh
      } = this.$store.state.people.trades;
      const { page, perPage } = pagination;

      if (refresh == false) {
        this.tradesLoading = false;
        return (this.trades = trades);
      }

      this.$axios
        .get("trades", { params: { associations, page, perPage } })
        .then((response) => {
          this.$store.commit("people/trades/setTrades", response.data.data);
          this.$store.commit("people/trades/setPagination", response.data);
          this.trades = this.$store.state.people.trades.trades;
          this.tradesLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      return true;
    },
    submitTrades() {
      if (!this.validateForm("create-trades-form")) {
        return false;
      }

      this.disabled = true;
      var name = [];

      for (const trade of this.newTrades) {
        name.push(trade.name);
      }

      this.$axios
        .post("trades/store-many", { name })
        .then((response) => {
          this.disabled = false;
          this.$store.commit("people/trades/setTrades", response.data.trades);
          this.newTradesArray = [];
          this.newTrades = [];
          this.add1Trade();
          this.$store.commit("people/trades/toggleRefresh");
          this.getTrades();
        })
        .catch((error) => {
          console.log(error);
          this.disabled = false;
          var response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          }
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin]
};
</script>
