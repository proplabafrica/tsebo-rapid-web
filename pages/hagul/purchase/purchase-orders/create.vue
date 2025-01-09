<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/purchase-orders"
            >Purchase Orders</nuxt-link
          >
        </li>
        <li class="breadcrumb-item">Create Purchase Order</li>
      </ol>
      <h6 class="slim-pagetitle">Create Purchase Order</h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading">
      <form
        id="create-purchase-order-form"
        class="table-responsive mg-t-20"
        v-if="quotation.status.code == 'approved'"
      >
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th class="tx-right">Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in quotation.approvedItems" :key="item.id">
              <td>
                <nuxt-link
                  :to="`/hagul/inventory/materials/details?id=${
                    item.tenderItem[item.tenderItem.deliveryType.code].id
                  }`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  v-text="
                    item.tenderItem[item.tenderItem.deliveryType.code].name
                  "
                ></nuxt-link>
              </td>
              <td>
                <span v-text="item.tenderItem.quantity"></span>
              </td>
              <td class="tx-right">
                <span
                  class="tx-14 tx-medium"
                  v-html="
                    quotation.currency.unicode +
                    $options.filters.moneyFormat(parseFloat(item.price))
                  "
                ></span>
              </td>
              <td class="tx-right">
                <span
                  class="tx-14 tx-medium"
                  v-html="
                    quotation.currency.unicode +
                    $options.filters.moneyFormat(
                      parseFloat(item.tenderItem.quantity) *
                        parseFloat(item.price)
                    )
                  "
                ></span>
              </td>
            </tr>
            <tr v-if="quotation.approvedItems.length > 0">
              <td colspan="2" rowspan="4" class="valign-middle">
                <div class="form-group">
                  <label class="form-control-label">Notes</label>
                  <textarea
                    name="notes"
                    v-model="notes"
                    class="form-control"
                  ></textarea>
                </div>
              </td>
              <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                Total
              </td>
              <td colspan="1" class="tx-right">
                <h4
                  class="tx-primary tx-bold tx-lato"
                  v-html="
                    quotation.currency.unicode +
                    $options.filters.moneyFormat(total.toFixed(2))
                  "
                ></h4>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="quotation.approvedItems.length > 0" class="row">
          <div class="form-group col-md-3" style="color: #5b636a">
            <label class="form-control-label"> Job Criticality </label>
            <span class="d-flex flex-column">
              <select
                class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize"
                name="payment_terms"
                v-model="criticality"
                @change="setPaymentTerm($event)"
              >
                <option :value="null">Criticality</option>
                <option
                  v-for="item in paymentTerms"
                  :key="item.id"
                  :value="item.criticality"
                >
                  {{ item.criticality }}
                </option>
              </select>
            </span>
          </div>

          <div class="form-group col-md-3" style="color: #5b636a">
            <label class="form-control-label"> Duration </label>
            <span class="d-flex gap-4">
              <input
                class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize"
                type="number"
                name="no_of_days"
                v-model="duration"
              />

              <select
                class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize"
                name="duration_unit"
                v-model="duration_unit"
                @change="setDurationUnit($event)"
              >
                <option
                  v-for="item in ['days', 'weeks', 'months']"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
              <!-- <option :value="null">Criticality</option>
                <option v-for="item in paymentTerms" :key="item.id" :value="item.criticality">
                  {{ item.criticality }}
                </option>
               -->
            </span>
          </div>
        </div>

        <div class="form-group mg-t-10" style="color: #5b636a">
          <label class="form-control-label"> Supporting Documents </label>
          <div class="col-md-6 col-lg-4" v-if="purchaseOrderDocuments.length">
            <ul class="list-group" style="list-style: disc !important; color: blue;" v-for="doc in purchaseOrderDocuments" :key="doc.id">
              <li class="list-group-item bd-0">
                <p class="mg-b-0">
                  <a :href="doc.link" target="_blank" :title="doc.link">
                    <span class="">{{ doc.name }}</span>
                  </a>
                  <i class="icon ion-android-delete tx-danger" style="cursor: pointer;" @click="deleteDocumentLink(doc.id)"></i>
                </p>
              </li>
            </ul>
          </div>
          <div v-if="quotation.approvedItems.length > 0" class="row">
            <div class="form-group col-md-3" style="color: #5b636a">
              <div class="d-flex justify-content-between align-items-center">
                <span class="d-flex gap-4">
                  <input
                    class="form-control wd-200 mg-t-5 mg-b-0"
                    type="text"
                    name="document_name"
                    placeholder="Document Name"
                    v-model="purchaseOrderDocument.name"
                  />
                  <small class="tx-danger tx-bold" v-if="validationErrors.document_name"
                    v-text="validationErrors.document_name"></small>
                </span>
              </div>
            </div>

            <div class="form-group col-md-3" style="color: #5b636a">
              <div class="d-flex justify-content-between align-items-center">
                <span class="d-flex gap-4">
                  <input
                    class="form-control wd-200 mg-t-5 mg-b-0"
                    type="text"
                    name="document_link"
                    placeholder="Document Link"
                    v-model="purchaseOrderDocument.link"
                  />
                  <small class="tx-danger tx-bold" v-if="validationErrors.document_link"
                    v-text="validationErrors.document_link"></small>
                </span>
                <v-button
                  :disabled="purchaseOrderDocumentsLoading"
                  @click="saveDocumentLink()"
                  class="btn btn-primary mg-l-5 mg-t-5"
                  >SAVE</v-button
                >
              </div>
            </div>
          </div>
        </div>

        <div class="mg-t-20 form-layout-footer tx-center">
          <v-button
            :disabled="disabled"
            @click="submitPurchaseOrder()"
            class="btn btn-primary"
            >SUBMIT</v-button
          >
        </div>
      </form>
      <static-error
        v-else
        :error="{ title: 'Cannot Create Purchase Order For this Quotation' }"
        :redirect="{
          route: `/hagul/purchase/tender-processes/details/bidding?id=${quotation.tender_process_id}`,
          text: 'Go To Tender Process'
        }"
      />
    </div>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import vSelect from "vue-select";
import { mapActions } from "vuex";

export default {
  components: { loading, staticError, vButton, vSelect },
  computed: {
    total() {
      var total = 0;
      for (const item of this.quotation.approvedItems) {
        total += item.price * parseFloat(item.tenderItem.quantity);
      }
      return total;
    }
  },
  created() {
    this.setQuotation(this.$route.query["quotation-id"]);
    this.getPaymentTerms(this)
      .then(() => {
        const paymentTerm = this.paymentTerms.find(
          (paymentTerm) => paymentTerm.criticality === "Urgent"
        );
        this.criticality = paymentTerm.criticality;
        this.duration = paymentTerm.duration;
        this.paymentTermId = paymentTerm.id;
      })
      .catch((error) => console.error(error));
  },
  data: () => ({
    disabled: false,
    loading: true,
    notes: "",
    quotation: null,
    shouldRefresh: true,
    validationErrors: {},
    paymentTerms: [],
    paymentTermsLoading: false,
    criticality: "",
    duration: 1,
    duration_unit: "days",
    paymentTermId: null,
    purchaseOrderDocument: {
      name: "",
      link: ""
    },
    purchaseOrderDocuments: [],
    purchaseOrderDocumentsLoading: false
  }),
  head: () => ({
    title: "Create Purchase Order · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.store"
  },
  methods: {
    ...mapActions({
      getPaymentTerms: "hagul/paymentTerms/getPaymentTerms"
    }),
    setDurationUnit(event) {
      this.duration_unit = event.target.value;
    },
    setPaymentTerm(event) {
      const paymentTerm = this.paymentTerms.find(
        (paymentTerm) => paymentTerm.criticality === event.target.value
      );
      this.criticality = paymentTerm.criticality;
      this.duration = paymentTerm.duration;
      this.paymentTermId = paymentTerm.id;
    },
    setQuotation(id) {
      const { quotations } = this.$store.state.hagul.purchase.quotations;
      this.quotation = quotations.find((quotation) => quotation.id == id);
      if (this.quotation && !this.shouldRefresh) {
        if (Array.isArray(this.quotation.approvedItems)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("quotations/" + id, {
          params: {
            associations: [
              "currency",
              "files",
              "approvedItems.tenderItem.deliveryType",
              "approvedItems.tenderItem.material",
              "approvedItems.tenderItem.service",
              "status",
              "vendor"
            ]
          }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/purchase/quotations/setQuotation",
            response.data.quotation
          );
          this.quotation = this.quotation
            ? Object.assign({}, response.data.quotation)
            : response.data.quotation;
          this.getDocumentLinks()
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("hagul/purchase/quotations/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteDocumentLink(id) {
      try {
        await this.$axios.delete(`purchase-order-document-links/${id}`);
        await this.getDocumentLinks();
      } catch (error) {
        console.log(error);
      }
    },
    async getDocumentLinks() {
      try {
        const response = await this.$axios.get("purchase-order-document-links", {
          params: {
            byQuotationId: this.quotation.id
          }
        });
        this.purchaseOrderDocuments = response.data.data;
      } catch(error) {
        console.log(error)
      }
    },
    saveDocumentLink() {
      if (this.purchaseOrderDocument.name && this.purchaseOrderDocument.link) {
        this.$axios.post("purchase-order-document-links", {
          name: this.purchaseOrderDocument.name,
          link: this.purchaseOrderDocument.link,
          quotation_id: this.quotation.id
        }).then(async () => {
          this.purchaseOrderDocumentsLoading = true;
          await this.getDocumentLinks();
          this.purchaseOrderDocumentsLoading = false;
          this.purchaseOrderDocument = {
            name: "",
            link: ""
          }
        });
      } else if (!this.purchaseOrderDocument.name) {
        this.validationErrors.document_name = "Document name required!"
      } else if (!this.this.purchaseOrderDocument.link) {
        this.validationErrors.document_name = "Document link required!"
      }
    },
    submitPurchaseOrder() {
      if (!this.validateForm("create-purchase-order-form")) return false;

      this.duration = this.duration ? this.duration : 1;
      this.disabled = true;
      const notes = this.notes;
      const quotation_id = this.quotation.id;
      const payment_term_id = this.paymentTermId;
      const duration = this.duration ? this.duration : 1;
      const duration_unit = this.duration_unit;

      this.$axios
        .post("purchase-orders", {
          notes,
          quotation_id,
          payment_term_id,
          duration,
          duration_unit
        })
        .then((response) => {
          this.disabled = false;
          this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
          this.$router.push(
            `/hagul/purchase/purchase-orders/details?id=${response.data.purchaseOrder.id}`
          );
        })
        .catch((error) => {
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
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin]
};
</script>

<style scoped>
::-webkit-scrollbar {
  height: 0px;
  /* Adjust the width as needed */
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color of the scrollbar thumb */
}
</style>

<style scoped>
::-webkit-scrollbar {
  height: 0px;
  /* Adjust the width as needed */
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color of the scrollbar thumb */
}
</style>
