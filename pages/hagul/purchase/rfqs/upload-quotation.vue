<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/rfqs">Quotation Requests</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="
          rfq
            ? 'Upload Quotations For #' + rfq.tenderProcess.code
            : 'Quotation Upload'
        "></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        rfq
          ? 'Upload Quotation For #' + rfq.tenderProcess.code
          : 'Quotation Upload'
      "></h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading" class="mg-t-20">
      <form id="submit-quotations-form" v-if="
        rfq.tenderProcess.status.code == 'rfq-sent' &&
        rfq.response_submitted_at == null
      ">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="tx-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in quotation.items" :key="item.id">
                <td>
                  <span class="tx-14 tx-medium" v-text="thisOrThat(item, ['material', 'service']).name"></span>
                </td>
                <td>
                  <span class="tx-14 tx-medium" v-text="item.quantity"></span>
                </td>
                <td>
                  <input type="number" step="any" min="0" :name="'price' + item.id" v-model="item.price"
                    class="form-control" required />
                  <small class="tx-bold tx-danger" v-if="validationErrors['price' + item.id]"
                    v-text="validationErrors['price' + item.id]"></small>
                </td>
                <td class="tx-right">
                  <span class="tx-14 tx-medium" v-html="
                    thisOrThat(item, ['material', 'service']).currency
                      .unicode +
                    $options.filters.moneyFormat(
                      item.quantity * parseFloat(item.price)
                    )
                  "></span>
                </td>
              </tr>
              <tr v-if="quotation.items.length > 0">
                <td colspan="2" rowspan="4" class="valign-middle"></td>
                <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                  Total
                </td>
                <td colspan="1" class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato" v-html="
                    thisOrThat(quotation.items[0], ['material', 'service'])
                      .currency.unicode + $options.filters.moneyFormat(total)
                  "></h4>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="form-group wd-300">
          <label class="form-control-label">
            Quotation File (Max 2MB)
            <span class="tx-danger">*</span>
          </label>
          <div class="custom-file">
            <input type="file" @change="
              convertToBase64($event).then((data) => {
                quotation.file = data.file;
                quotation.file_name = data.file_name;
              })
            " class="custom-file-input" name="file" title="Select a file 1MB or less" required />
            <label class="custom-file-label" for="customFile" v-text="quotation.file_name"></label>
          </div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
        </div>
        <div class="form-layout-footer tx-center mg-t-20">
          <v-button :disabled="disabled" @click="submitQuotation()" class="btn btn-primary">SUBMIT</v-button>
        </div>
      </form>
      <static-error v-else :error="{ title: 'Quotation Upload Not Open' }" :redirect="{
        route: `/hagul/purchase/quotations`,
        text: 'View Quotations'
      }" />
    </div>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import quotationsList from "@/components/hagul/purchase/quotations/list";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: {
    loading,
    quotationsList,
    staticError,
    vButton
  },
  computed: {
    total() {
      var total = 0;
      for (const item of this.quotation.items) {
        total += item.price * parseFloat(item.quantity);
      }
      return total;
    }
  },
  created() {
    this.setRfq(this.$route.query.id);
  },
  data: () => ({
    disabled: false,
    loading: true,
    validationErrors: {},
    quotation: {
      currency_id: "",
      file: "",
      file_name: "Select File",
      items: []
    },
    rfq: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Upload Quotations · Hagul"
  }),
  meta: {
    pageName: "quotations.store"
  },
  methods: {
    populateItems() {
      this.quotation.items = [];
      for (const item of this.rfq.tenderProcess.items) {
        this.quotation.items.push(Object.assign({ price: "" }, item));
      }
    },
    async setRfq(id) {
      const { rfqs } = this.$store.state.hagul.purchase.rfqs;
      this.rfq = rfqs.find((rfq) => rfq.id == id);
      if (this.rfq && !this.shouldRefresh) {
        this.populateItems();
        return (this.loading = false);
      }

      try {
        const response = await this.$axios.get("rfqs/" + id, {
          params: {
            associations: [
              "tenderProcess.items.material.currency",
              "tenderProcess.items.service.currency",
              "tenderProcess.status"
            ]
          }
        });
        this.$store.commit("hagul/purchase/rfqs/setRfq", response.data.rfq);
        this.rfq = this.rfq
          ? Object.assign({}, response.data.rfq)
          : response.data.rfq;
        this.populateItems();
        this.loading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/purchase/rfqs/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async submitQuotation() {
      if (!this.validateForm("submit-quotations-form")) return false;

      this.disabled = true;
      const rfq_id = this.rfq.id;
      const tender_process_id = this.rfq.tenderProcess.id;
      const { currency_id, file, file_name } = this.quotation;
      const tender_process_item_id = this.quotation.items.map(
        (item) => item.id
      );
      const price = this.quotation.items.map((item) => item.price);

      try {
        await this.$axios.post("quotations", {
          rfq_id,
          currency_id,
          file,
          file_name,
          tender_process_item_id,
          price
        });
        this.disabled = false;
        this.$router.push("/hagul/purchase/quotations");
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
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setRfq(to.query.id);
    }
  }
};
</script>
