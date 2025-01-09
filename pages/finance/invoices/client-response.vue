<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/finance/invoices">Invoices</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Upload Client Response
          <span v-if="invoice">
            For
            <nuxt-link :to="`/finance/invoices/details?id=${invoice.id}`" v-text="`#${invoice.code}`"></nuxt-link>
          </span>
        </li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        invoice
          ? `Upload Client Response for #${invoice.code}`
          : 'Upload Client Response'
      "></h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading">
      <div class="section-wrapper" v-if="invoice.status.code == 'negotiating'">
        <form id="upload-client-response-form">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Recommended Unit Price</th>
                  <th>Unit Cost To Client</th>
                  <th>Total Cost To Client</th>
                </tr>
              </thead>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>
                  <span v-text="index + 1"></span>
                </td>
                <td v-if="item.material">
                  <nuxt-link :to="
                    `/hagul/inventory/materials/details?id=${item.material.id}`
                  " class="tx-inverse tx-14 tx-medium d-block" v-text="item.material.name"></nuxt-link>
                  <span class="tx-11 d-block">#{{ item.material.code }}</span>
                  <span class="tx-11 d-block">Stock: {{ item.material.stock }}</span>
                </td>
                <td v-if="item.service">
                  <nuxt-link :to="
                    `/hagul/inventory/services/details?id=${item.service.id}`
                  " class="tx-inverse tx-14 tx-medium d-block" v-text="item.service.name"></nuxt-link>
                </td>
                <td>
                  <span v-text="item.quantity"></span>
                </td>
                <td>
                  <span v-html="
                    thisOrThat(item, ['material', 'service']).currency
                      .unicode +
                      $options.filters.moneyFormat(
                        thisOrThat(item, ['material', 'service']).cost
                      )
                  "></span>
                </td>
                <td>
                  <input type="number" step="any" :oldmin="thisOrThat(item, ['material', 'service']).cost"
                    :name="'amount' + item.id" v-model="item.amount" class="form-control" required />
                  <small class="tx-bold tx-danger" v-if="validationErrors['amount' + item.id]"
                    v-text="validationErrors['amount' + item.id]"></small>
                </td>
                <td class="tx-right">
                  <span v-html="
                    thisOrThat(item, ['material', 'service']).currency
                      .unicode +
                      $options.filters.moneyFormat(
                        item.amount * parseFloat(item.quantity)
                      )
                  "></span>
                </td>
              </tr>
              <tr v-if="items.length > 0">
                <td colspan="4" rowspan="4" class="valign-middle">
                  <h4>
                    Profit:
                    <span class="tx-bold" :class="[profitClass]">{{
                    (((total - totalCost) / total) * 100) | twoDP
                    }}%</span>
                  </h4>
                  <div class="form-group" v-if="authorized('invoices.send-to-client')">
                    <label class="form-control-label">
                      Client Response Document
                      <span class="tx-danger">*</span>
                    </label>
                    <div class="custom-file">
                      <input type="file" @change="
                        convertToBase64($event).then(data => {
                          file = data.file;
                          file_name = data.file_name;
                        })
                      " class="custom-file-input" name="file" title="Select an image file of 1MB or less" required />
                      <label class="custom-file-label" for="customFile" v-text="file_name"></label>
                    </div>
                    <!-- custom-file -->
                    <small class="tx-bold tx-danger" v-if="validationErrors.file"
                      v-text="validationErrors.file"></small>
                  </div>
                </td>
                <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                  Total
                </td>
                <td colspan="1" class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato" v-html="
                    thisOrThat(items[0], ['material', 'service']).currency
                      .unicode + $options.filters.moneyFormat(total)
                  "></h4>
                </td>
              </tr>
            </table>
          </div>
          <!-- table-responsive -->
          <div class="form-layout-footer tx-center mg-t-20">
            <v-button class="btn btn-primary bd-0 pd-x-25 mg-x-10" :disabled="disabled" @click="uploadClientResponse()">
              SUBMIT</v-button>
          </div>
        </form>
      </div>
      <static-error v-else :error="{ title: 'Cannot Upload Client Response' }" :redirect="{
        route: `/finance/invoices/details?id=${invoice.id}`,
        text: 'Go To Invoice'
      }" />
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, staticError, vButton },
  computed: {
    profitClass() {
      return this.total > this.totalCost ? "tx-teal" : "tx-danger";
    },
    totalCost() {
      return this.items.reduce((total, item) => {
        return (
          total +
          this.thisOrThat(item, ["material", "service"]).cost *
          parseFloat(item.quantity)
        );
      }, 0);
    },
    total() {
      var total = 0;
      for (const item of this.items) {
        total += item.amount * parseFloat(item.quantity);
      }
      return total;
    }
  },
  created() {
    this.setInvoice(this.$route.query.id);
  },
  data: () => ({
    disabled: false,
    items: [],
    loading: true,
    shouldRefresh: true,
    validationErrors: {},
    invoice: null,
    file: "",
    file_name: "Select File"
  }),
  head: () => ({
    title: "Upload Client Response · Tsebo-Rapid"
  }),
  meta: {
    pageName: "invoices.store-client-response"
  },
  methods: {
    populateItems() {
      this.items = [];
      for (const item of this.invoice.items) {
        this.items.push(
          Object.assign(
            { amount: this.thisOrThat(item, ["material", "service"]).cost },
            item
          )
        );
      }
      if (this.items.length < 1) this.add1Item();
    },
    uploadClientResponse() {
      if (!this.validateForm("upload-client-response-form")) return false;
      this.disabled = true;

      const { file, file_name } = this;
      const invoice_id = this.invoice.id;
      const item_id = this.items.map(item => item.id);
      const amount = this.items.map(item => item.amount);

      this.$axios
        .post("invoices/store-client-response", {
          file,
          file_name,
          invoice_id,
          item_id,
          amount
        })
        .then(response => {
          this.disabled = false;
          this.$router.push(
            `/finance/invoices/details?id=${response.data.invoice.id}`
          );
        })
        .catch(error => {
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
        });
    },
    setInvoice(id) {
      const {
        detailedAssociations,
        invoices
      } = this.$store.state.finance.invoices;
      this.invoice = invoices.find(invoice => invoice.id == id);
      if (this.invoice && !this.shouldRefresh) {
        if (Array.isArray(this.invoice.items)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("invoices/" + id, {
          params: {
            associations: [
              "items.material.currency",
              "items.service.currency",
              "status"
            ]
          }
        })
        .then(response => {
          this.$store.commit(
            "finance/invoices/setInvoice",
            response.data.invoice
          );
          this.invoice = this.invoice
            ? Object.assign({}, response.data.invoice)
            : response.data.invoice;
          this.loading = false;
          this.shouldRefresh = false;
          this.populateItems();
          this.$store.commit("finance/invoices/toggleRefresh");
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin],
  watch: {
    $route(to, from) {
      this.setInvoice(to.query.id);
    }
  }
};
</script>
