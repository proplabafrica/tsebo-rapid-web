<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/tender-processes">Tender Processes</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="
          tenderProcess
            ? 'Upload Quotations For #' + tenderProcess.code
            : 'Request Quotations'
        "></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        tenderProcess
          ? 'Upload Quotations For #' + tenderProcess.code
          : 'Request Quotations'
      "></h6>
    </div>

    <!-- slim-pageheader -->

    <div v-if="!loading" class="mg-t-20">
      <form id="submit-quotations-form" class="row" v-if="tenderProcess.status.code == 'rfq-sent'">
        <div class="col">
          <div class="table-responsive" v-if="pendingRfqs.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th class="tx-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in quotation.items" :key="item.id">
                  <td v-if="item.material || item.service">
                    <span>{{ index + 1 }}</span>
                  </td>
                  <td v-if="item.material || item.service">
                    <span class="tx-14 tx-medium" v-text="thisOrThat(item, ['material', 'service']).name"></span>
                  </td>
                  <td v-if="item.material || item.service">
                    <span class="tx-14 tx-medium" v-text="item.quantity"></span>
                  </td>
                  <td v-if="item.material || item.service">
                    <input type="number" step="any" min="0" :name="'price' + item.id" v-model="item.price"
                      class="form-control" required />
                    <small class="tx-bold tx-danger" v-if="validationErrors['price' + item.id]"
                      v-text="validationErrors['price' + item.id]"></small>
                  </td>
                  <td class="tx-right" v-if="item.material || item.service">
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
                  <td></td>
                  <td colspan="2" rowspan="4" class="valign-middle"></td>
                  <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                    Total
                  </td>
                  <td colspan="1" class="tx-right">
                    <h4 class="tx-primary tx-bold tx-lato" v-html="
                      getCurrency(quotation.items).currency.unicode +
                      $options.filters.moneyFormat(total)
                    "></h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr class="mg-t-20" v-if="pendingRfqs.length > 0" />
          <div class="table-responsive" v-if="tenderProcess.quotations.length > 0">
            <h6 class="slim-card-title mg-b-20">Quotations</h6>
            <quotations-list :quotations="tenderProcess.quotations" />
            <div class="form-layout-footer mg-t-20 tx-center">
              <a href="#" v-modal-open="'close-quotation-upload-modal'" class="btn btn-primary bd-0">CLOSE QUOTATION
                UPLOAD</a>
              <v-modal ref="close-quotation-upload-modal">
                <div class="modal-dialog wd-300 wd-sm-400" role="document">
                  <div class="modal-content tx-size-sm">
                    <div class="modal-body tx-center pd-y-20 pd-x-20">
                      <button type="button" class="close" v-modal-close="'close-quotation-upload-modal'"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h4 class="mg-b-20">Close Upload Process?</h4>
                      <p class="mg-b-20 mg-x-20" v-if="tenderProcess.quotations.length < 3">
                        You have not uploaded up to 3 quotations for this
                        process say why
                      </p>
                      <form id="close-quotation-upload-form">
                        <div class="form-group" v-if="tenderProcess.quotations.length < 3">
                          <label class="form-control-label">
                            Comment
                            <span class="tx-danger">*</span>
                          </label>
                          <div class="input-group pd-x-20">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                <i class="
                                    icon
                                    ion-ios-chatbubble
                                    tx-16
                                    lh-0
                                    op-6
                                  "></i>
                              </span>
                            </div>
                            <textarea name="close-upload-text" v-model="closeUploadText" class="form-control"
                              required></textarea>
                          </div>
                          <small class="tx-bold tx-danger" v-if="validationErrors['close-upload-text']"
                            v-text="validationErrors['close-upload-text']"></small>
                        </div>
                        <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disableCloseQuotationUpload"
                          @click="closeQuotationUpload()">
                          <i class="icon ion-ios-checkmark-outline"></i> Confirm
                        </v-button>
                        <button type="button" class="btn btn-danger pd-x-25"
                          v-modal-close="'close-quotation-upload-modal'" aria-label="Close"
                          :disabled="disableCloseQuotationUpload">
                          <i class="icon ion-ios-close-outline"></i> Cancel
                        </button>
                      </form>
                    </div>
                    <!-- modal-body -->
                  </div>
                  <!-- modal-content -->
                </div>
                <!-- modal-dialog -->
              </v-modal>
            </div>
          </div>
        </div>
        <div class="col-lg-3 mg-t-10 mg-lg-0" v-if="pendingRfqs.length > 0">
          <div class="card card-body pd-20">
            <div class="form-group">
              <label class="form-control-label">
                Select Vendor
                <span class="tx-danger">*</span>
              </label>
              <select name="rfq_id" class="form-control" required v-model="quotation.rfq_id">
                <option value>Select Vendor</option>
                <option v-for="rfq in pendingRfqs" :key="rfq.id" :value="rfq.id" v-text="rfq.vendor.business_name">
                </option>
              </select>
              <input type="text" name="vendor_ids" class="d-none" />
              <small class="tx-bold tx-danger" v-if="validationErrors.rfq_id" v-text="validationErrors.rfq_id"></small>
            </div>
            <div class="form-group">
              <label class="form-control-label">
                Quotation File
                <!-- <span class="tx-danger">*</span> -->
              </label>
              <div class="custom-file">
                <input type="file" @change="
                  convertToBase64($event).then((data) => {
                    quotation.file = data.file;
                    quotation.file_name = data.file_name;
                  })
                " class="custom-file-input" name="file" title="Select a file 1MB or less" />
                <label class="custom-file-label" for="customFile" v-text="quotation.file_name"></label>
              </div>
              <!-- custom-file -->
              <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
            </div>
            <v-button :disabled="disabled" @click="submitQuotation()" class="btn btn-primary btn-block">SUBMIT
            </v-button>
          </div>
        </div>
      </form>
      <static-error v-else :error="{ title: 'Quotation Upload Not Open' }" :redirect="{
        route: `/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`,
        text: 'Go To Tender Process'
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
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: {
    loading,
    quotationsList,
    staticError,
    vButton,
    vModal
  },
  computed: {
    total() {
      var total = 0;
      for (const item of this.quotation.items) {
        total += item.price * parseFloat(item.quantity);
      }
      return total;
    },
    pendingRfqs() {
      if (!this.tenderProcess) return [];
      if (!Array.isArray(this.tenderProcess.rfqs)) return [];
      return this.tenderProcess.rfqs.filter((rfq) => {
        const matchingQuotation = this.tenderProcess.quotations.find(
          (quotation) => quotation.vendor_id == rfq.vendor_id
        );
        return matchingQuotation ? false : true;
      });
    }
  },
  created() {
    this.setTenderProcess(this.$route.query.id);
    for (const i in this.authUser?.roles) {
      if (this.authUser?.roles[i].code == "PM") {
        this.isPM = true;
        break;
      }
    }
  },
  data: () => ({
    isPM: false,
    disabled: false,
    disableCloseQuotationUpload: false,
    loading: true,
    tenderProcess: null,
    validationErrors: {},
    quotation: {
      currency_id: "",
      file: "",
      file_name: "Select File",
      rfq_id: "",
      items: []
    },
    shouldRefresh: true,
    closeUploadText: ""
  }),
  head: () => ({
    title: "Upload Quotations · Hagul"
  }),
  meta: {
    pageName: "quotations.store"
  },
  methods: {
    getCurrency(items) {
      var i = 0;

      while (!this.thisOrThat(items[i], ["material", "service"])) {
        i++;
      }

      return this.thisOrThat(items[i], ["material", "service"]);
    },
    closeQuotationUpload() {
      if (!this.validateForm("close-quotation-upload-form")) return false;

      this.disableCloseQuotationUpload = true;
      const tender_process_id = this.tenderProcess.id;
      const text = this.closeUploadText;

      this.$axios
        .post("tender-processes/close-quotation-upload", {
          tender_process_id,
          text
        })
        .then((response) => {
          this.disableCloseQuotationUpload = false;
          this.closeModal("close-quotation-upload-modal");
          this.$router.push(
            `/hagul/purchase/tender-processes/select-vendors?id=${this.tenderProcess.id}`
          );
        })
        .catch((error) => {
          console.log(error);
          this.disableCloseQuotationUpload = false;
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
    populateItems() {
      this.quotation.items = [];
      for (const item of this.tenderProcess.items) {
        this.quotation.items.push(Object.assign({ price: "" }, item));
      }
    },
    setTenderProcess(id) {
      const { tenderProcesses } =
        this.$store.state.hagul.purchase.tenderProcesses;
      this.tenderProcess = tenderProcesses.find(
        (tenderProcess) => tenderProcess.id == id
      );
      if (this.tenderProcess && !this.shouldRefresh) {
        if (
          Array.isArray(this.tenderProcess.items) &&
          Array.isArray(this.tenderProcess.rfqs)
        ) {
          this.populateItems();
          return (this.loading = false);
        }
      }

      this.$axios
        .get("tender-processes/" + id, {
          params: {
            associations: [
              "items.material.currency",
              "items.service.currency",
              "quotations.createdBy",
              "quotations.currency",
              "quotations.files",
              "quotations.status",
              "quotations.vendor",
              "rfqs.vendor",
              "status"
            ]
          }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/purchase/tenderProcesses/setTenderProcess",
            response.data.tenderProcess
          );
          this.tenderProcess = this.tenderProcess
            ? Object.assign({}, response.data.tenderProcess)
            : response.data.tenderProcess;
          this.populateItems();
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitQuotation() {
      if (!this.validateForm("submit-quotations-form")) return false;

      this.disabled = true;
      const tender_process_id = this.tenderProcess.id;
      const { currency_id, file, file_name, rfq_id } = this.quotation;
      this.quotation.items = this.quotation.items.filter(
        (item) => item.material || item.service
      );
      const tender_process_item_id = this.quotation.items.map(
        (item) => item.id
      );
      const price = this.quotation.items.map((item) => item.price);

      this.$axios
        .post("quotations", {
          rfq_id,
          currency_id,
          file,
          file_name,
          tender_process_item_id,
          price
        })
        .then((response) => {
          this.disabled = false;
          this.quotation = {
            currency_id: "",
            file: "",
            file_name: "Select File",
            rfq_id: "",
            items: []
          };
          this.shouldRefresh = true;
          this.setTenderProcess(this.tenderProcess.id);
        })
        .catch((error) => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response.status == 413) {
            this.validationErrors.file = response.statusText;
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {}
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setTenderProcess(to.query.id);
    }
  }
};
</script>
