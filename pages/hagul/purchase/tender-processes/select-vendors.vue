<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/tender-processes"
            >Tender Processes</nuxt-link
          >
        </li>
        <li class="breadcrumb-item">
          Select Vendors
          <span v-if="tenderProcess">
            For
            <nuxt-link
              :to="`/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`"
            ></nuxt-link>
          </span>
        </li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="
          tenderProcess
            ? 'Select Vendors for  #' + tenderProcess.code
            : 'Vendor Selection'
        "
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading" class="mg-t-20">
      <form
        id="vendor-selection-form"
        v-if="tenderProcess.status.code == 'quotation-upload-closed'"
      >
        <div class="form-group wd-300">
          <label class="form-control-label">
            Select Vendor
            <span class="tx-danger">*</span>
          </label>
          <select
            name="rfq_id"
            class="form-control"
            v-model="quotationId"
            @change="autoFillVendorSelection()"
          >
            <option value>Select Vendor</option>
            <option
              v-for="quotation in tenderProcess.quotations"
              :key="quotation.id"
              :value="quotation.id"
              v-text="quotation.vendor.business_name"
            ></option>
          </select>
        </div>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Vendor</th>
                <th class="tx-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td v-if="item.material || item.service">
                  <span
                    class="tx-14 tx-medium"
                    v-text="thisOrThat(item, ['material', 'service']).name"
                  ></span>
                </td>
                <td v-if="item.material || item.service">
                  <span class="tx-14 tx-medium" v-text="item.quantity"></span>
                </td>
                <td v-if="item.material || item.service">
                  <div>{{ vendorData }}</div>

                  <!-- <select
                    class="form-control"
                    v-model="quotationId"
                    @change="autoFillVendorSelection()"
                  >
                    <option value>Select Vendor</option>
                    <option
                      v-for="quotationItem in item.quotationItems"
                      :key="quotationItem.id"
                      :value="quotationItem.id"
                      v-text="quotationItem.quotation.vendor.business_name"
                    ></option>
                  </select> -->

                  <input
                    type="number"
                    step="any"
                    :value="item.quotationItem.price"
                    required
                    :name="'quotation_item_price' + item.id"
                    class="d-none"
                  />
                  <small
                    class="tx-bold tx-danger"
                    v-if="validationErrors['quotation_item_price' + item.id]"
                    v-text="validationErrors['quotation_item_price' + item.id]"
                  ></small>
                </td>
                <td class="tx-right" v-if="item.material || item.service">
                  <span
                    class="tx-14 tx-medium"
                    v-html="
                      thisOrThat(item, ['material', 'service']).currency
                        .unicode +
                      $options.filters.moneyFormat(
                        item.quantity * parseFloat(item.quotationItem.price)
                      )
                    "
                  ></span>
                </td>
                <!-- <td
                  class="tx-right"
                  v-if="
                    tenderProcess.negotiatedPrices.length &&
                    tenderProcess?.negotiatedPrices?.find(
                      (p) =>
                        p.vendor_id == item.quotationItem.quotation.vendor_id
                    )
                  "
                >
                  <span class="tx-14 tx-medium">{{
                    {
                      value:
                        tenderProcess?.negotiatedPrices?.find(
                          (p) =>
                            p.vendor_id ==
                            item.quotationItem.quotation.vendor_id
                        )?.negotiated_price * item.quantity
                    } | toMoney
                  }}</span>
                 
                </td> -->
                <!-- <td
                  class="tx-right"
                  v-else-if="tenderProcess.negotiatedPrices.length"
                >
                  N/A
                </td> -->
              </tr>
              <tr v-if="items.length > 0">
                <td colspan="2" rowspan="4" class="valign-middle"></td>
                <td
                  class="tx-right tx-uppercase tx-bold tx-inverse"
                  colspan="1"
                >
                  Total
                </td>
                <td class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato">
                    
                    {{
                      {
                        value: total
                      } | toMoney
                    }}
                  </h4>
                  <!-- <h4
                    class="tx-primary tx-bold tx-lato"
                    v-else
                    v-html="
                      getCurrency(items).currency.unicode +
                      $options.filters.moneyFormat(total)
                    "
                  ></h4> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-layout-footer tx-center">
          <div class="flex justify-content-between w-full">
            <a
              href="#"
              v-modal-open="'vendor-selection-modal'"
              class="btn btn-primary bd-0"
              >SUBMIT SELECTION</a
            >
            <button
              type="button"
              class="btn btn-primary bd-0"
              @click="selectVendor()"
            >
              EDIT COST
            </button>
          </div>

          <v-modal ref="vendor-selection-modal">
            <div class="modal-dialog wd-300 wd-sm-400" role="document">
              <div class="modal-content tx-size-sm">
                <div class="modal-body tx-center pd-y-20 pd-x-20">
                  <button
                    type="button"
                    class="close"
                    v-modal-close="'vendor-selection-modal'"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="mg-b-20">Confirm Vendor Selection</h4>
                  <p class="mg-b-20 mg-x-20" v-if="!leastPriceSelected">
                    You didn't select the lowest priced vendor. Please share why
                    below
                  </p>
                  <div class="form-group" v-if="!leastPriceSelected">
                    <label class="form-control-label">
                      Comment
                      <span class="tx-danger">*</span>
                    </label>
                    <div class="input-group pd-x-20">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i
                            class="icon ion-ios-chatbubble tx-16 lh-0 op-6"
                          ></i>
                        </span>
                      </div>
                      <textarea
                        name="vendor-selection-text"
                        v-model="vendorSelectionComment"
                        class="form-control"
                        required
                      ></textarea>
                    </div>
                    <small
                      class="tx-bold tx-danger"
                      v-if="validationErrors['vendor-selection-text']"
                      v-text="validationErrors['vendor-selection-text']"
                    ></small>
                  </div>
                  <v-button
                    type="button"
                    class="btn btn-primary pd-x-25"
                    :disabled="disabled"
                    @click="submitSelection()"
                  >
                    <i class="icon ion-ios-checkmark-outline"></i> Confirm
                  </v-button>
                  <button
                    type="button"
                    class="btn btn-danger pd-x-25"
                    v-modal-close="'vendor-selection-modal'"
                    aria-label="Close"
                    :disabled="disabled"
                  >
                    <i class="icon ion-ios-close-outline"></i> Cancel
                  </button>
                </div>
                <!-- modal-body -->
              </div>
              <!-- modal-content -->
            </div>
            <!-- modal-dialog -->
          </v-modal>
        </div>
      </form>
      <static-error
        v-else
        :error="{ title: 'Vendor Selection Not Open' }"
        :redirect="{
          route: `/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`,
          text: 'Go To Tender Process'
        }"
      />

      <!-- SUGGEST PRICE MODAL -->
      <div class="modal" v-if="showSuggestionModal">
        <form
          class="bg-white p-3 m-3 form"
          style="max-width: 100%"
          @submit.prevent="onConfirmNegotiation()"
        >
          <div class="wd-full">
            <div class="row justify-content-center">
              <div class="col-12 col-sm-6 col-md-12 col-lg-12">
                <!-- Form content here -->
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click="showSuggested = false"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <span class="lh-1 mg-t-20 mg-r-20 d-inline-block"></span>
                <h5>Would you like to edit the costing price?</h5>

                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th class="tx-left">Vendor</th>
                        <th class="tx-center wd-200">Quantity</th>
                        <th class="tx-center wd-200">Initial Price</th>
                        <th class="tx-center wd-200">Total Price</th>
                        <th class="tx-right wd-200">New Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="item.id">
                        <!-- INDEX  -->
                        <td>
                          <span
                            class="tx-14 tx-medium"
                            v-text="index + 1"
                          ></span>
                        </td>

                        <!-- VENDOR  -->
                        <td v-if="item.material || item.service" class="">
                          <div>{{ vendorData }}</div>
                        </td>
                        <td v-if="item.material || item.service">
                          <span
                            class="tx-14 tx-medium"
                            v-text="item.quantity"
                          ></span>
                        </td>

                        <td v-if="item.material || item.service">
                          <span
                            class="tx-14 tx-medium"
                            v-text="item.quotationItem.price"
                          ></span>
                        </td>

                        <td
                          v-if="item.material || item.service"
                          class="tx-center wd-200"
                        >
                          <span
                            class="tx-14 tx-medium"
                            v-html="
                              thisOrThat(item, ['material', 'service']).currency
                                .unicode +
                              $options.filters.moneyFormat(
                                item.quantity *
                                  parseFloat(item.quotationItem.price)
                              )
                            "
                          ></span>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            :oldmin="getQuotationItemCost(item)"
                            :name="'amount' + item.id"
                            v-model="item.quotationItem.edit_price"
                            class="form-control"
                            required
                          />
                          <small
                            class="tx-bold tx-danger"
                            v-if="validationErrors['amount' + item.id]"
                            v-text="validationErrors['amount' + item.id]"
                          ></small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- <div class="input">
                  <select
                    class="form-control"
                    style=""
                    @change.prevent="onSelect"
                    v-model="selectedVendor"
                  >
                    <option :value="null">Select Vendor</option>
                    <option
                      v-for="quotationItem in items[0]?.quotationItems"
                      :key="quotationItem.id"
                      v-text="quotationItem.quotation.vendor.business_name"
                      :value="quotationItem.quotation.vendor.id"
                    ></option>
                  </select>
                </div>

                <div class="input" v-if="negotiated_price[current_index]?.vendor_id">
                  <input
                    type="number"
                    class="form-control wd-200"
                    v-model="negotiated_price[current_index].negotiated_price"
                    required
                    placeholder="Type in negotiated price"
                  />
                </div>
                <div class="input" v-else>
                  <input
                    type="number"
                    class="form-control wd-200"
                    required
                    placeholder="Type in negotiated price"
                  />
                </div> -->

                <!-- @click="onConfirmNegotiation()" -->

                <div style="display: flex; justify-content: center">
                  <v-button
                    class="btn btn-primary"
                    type="submit"
                    @click="onConfirmNegotiation()"
                    >Submit</v-button
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal" v-if="confirmNegotiation && !showSuggested">
        <div class="bg-white p-3">
          <div class="col-12 col-sm-6 col-md-12 col-lg-12">
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="confirmNegotiation = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <h5>Please review the new price?</h5>

            <div class="table-responsive mg-t-20 mg-b-20">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th class="tx-left">Vendor</th>
                    <th class="tx-center wd-200">Quantity</th>
                    <th class="tx-center wd-200">Initial Price</th>
                    <th class="tx-center wd-200">Total Price</th>
                    <th class="tx-right wd-200">New Price</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in items" :key="item.id">
                    <!-- INDEX  -->
                    <td>
                      <span class="tx-14 tx-medium" v-text="index + 1"></span>
                    </td>

                    <!-- VENDOR  -->
                    <td v-if="item.material || item.service" class="">
                      <div>{{ vendorData }}</div>
                    </td>
                    <td v-if="item.material || item.service">
                      <span
                        class="tx-14 tx-medium"
                        v-text="item.quantity"
                      ></span>
                    </td>

                    <td v-if="item.material || item.service">
                      <span
                        class="tx-14 tx-medium"
                        v-text="item.quotationItem.price"
                      ></span>
                    </td>

                    <td
                      v-if="item.material || item.service"
                      class="tx-center wd-200"
                    >
                      <span
                        class="tx-14 tx-medium"
                        v-html="
                          thisOrThat(item, ['material', 'service']).currency
                            .unicode +
                          $options.filters.moneyFormat(
                            item.quantity * parseFloat(item.quotationItem.price)
                          )
                        "
                      ></span>
                    </td>
                    <td>
                      <span
                        class="tx-14 tx-medium"
                        
                      >
                      {{
                      {
                        value: item.quotationItem.edit_price
                      } | toMoney
                    }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row" style="justify-content: center; gap: 10px">
              <v-button
                :disabled="submittingSuggestion"
                class="btn"
                style="background-color: #dee2e6 !important"
                type="submit"
                @click="openNegotiation()"
                >Back</v-button
              >
              <v-button
                :disabled="submittingSuggestion"
                class="btn btn-primary"
                type="submit"
                @click="editSelection()"
                >{{ loadingData ? 'Loading...' : 'Continue'}}</v-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading v-else />
  </div>
</template>

<script>
import { orderBy } from "lodash";
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, staticError, vButton, vModal },
  computed: {
    showSuggestionModal() {
      if (!this.confirmSuggestion && this.showSuggested) {
        return true;
      } else {
        return false;
      }
    },
    totalCost() {
      for (const item of this.items) {
        if (item.quotationItem) {
          this.vendorData = item.quotationItem.quotation.vendor.business_name;
        }
      }

      return this.items.reduce(
        (total, item) =>
          total +
          parseFloat(this.getQuotationItemCost(item)) *
            parseFloat(item.quantity),
        0
      );

    },

    total() {
      var total = 0;
      for (const item of this.items) {
        if (item.quotationItem) {
          this.vendorData = item.quotationItem.quotation.vendor.business_name;
          total +=
            parseFloat(item.quotationItem.price) * parseFloat(item.quantity);
        }
      }
      return total;
    },
    leastPriceSelected() {
      var leastPriceSelected = true;
      for (const item of this.items) {
        if (item.quotationItem) {
          const leastPricedItem = orderBy(
            item.quotationItems,
            ["price"],
            ["asc"]
          )[0];
          if (leastPricedItem.price < item.quotationItem.price)
            leastPriceSelected = false;
        }
      }
      return leastPriceSelected;
    }
  },
  created() {
    this.setTenderProcess(this.$route.query.id);
    this.getWorkRequests();
  },
  data: () => ({
    disabled: false,
    loading: true,
    loadingData: false,

    tenderProcess: null,
    validationErrors: {},
    vendorSelectionComment: "",
    items: [],
    shouldRefresh: true,
    quotationId: "",

    vendor_id: 1,
    vendorIndex: 0,
    suggestion: null,
    showSuggested: false,
    confirmSuggestion: false,
    hasSubmitted: false,
    submittingSuggestion: false,
    selectedVendor: null,
    negotiated_price: [
      {
        vendor_id: null,
        negotiated_price: null,
        invoice_validity: new Date(),
        comments: null
      }
    ],
    itemList: [],
    desiredLength: null,
    invoice_validity: new Date(),
    comments: null,
    negotiated_errors: null,
    current_index: 0,
    workRequests: [],
    workRequestsLoading: true,
    confirmNegotiation: false,
    vendorData: ""
  }),
  head: () => ({
    title: "Request Quotations · Hagul"
  }),
  meta: {
    pageName: "tender-processes.select-vendors"
  },
  methods: {
    getQuotationItemCost(item) {
      if (item.quotationItem.edit_price) {
        return item.quotationItem.edit_price;
      }
      let cost = item.quotationItem.price;
      if (cost) return cost;
    },
    selectVendor() {
      this.showSuggested = true;
    },
    openNegotiation() {
      this.current_index = this.negotiated_price.findIndex(
        (np) => np.vendor_id == this.selectedVendor
      );

      this.showSuggested = true;

      this.confirmSuggestion = false;
    },
    getVendor(vendor_id) {
      try {
        const vendor = this.tenderProcess.quotations?.find(
          (q) => q.vendor_id == vendor_id
        );
        const vendorName = vendor?.vendor?.business_name;

        console.log("full event", vendorName, "big vendor", vendor);
        return vendorName;
      } catch (error) {
        console.log(error, "ERROR");
        return null;
      }
    },
    onConfirmNegotiation() {
      try {
        for (const items of this.items) {
          if (items.quotationItem.edit_price) {
            console.log("object", items.quotationItem.edit_price);
            this.showSuggested = false;
            this.confirmNegotiation = true;
          } else {
            this.toast({
              title: "Please enter edited prices",
              type: "danger"
            });
          }
          // console.log("price..", items.quotationItem.edit_price);
        }
      } catch (error) {
        this.toast({ title: "Please enter negotiated prices", type: "danger" });
      }
    },
    onSelect($e) {
      const vendor_id = $e.target.value;

      if (this.negotiated_price.find((p) => p.vendor_id === vendor_id)) {
        this.current_index = this.negotiated_price.findIndex(
          (p) => p.vendor_id === vendor_id
        );
      } else {
        this.negotiated_price.push({ vendor_id });
        this.current_index = this.negotiated_price.length - 1;
      }
    },
    async submitSuggestion() {
      const negotiated_price = this.negotiated_price.filter(
        (p) => p.negotiated_price !== null && p.vendor_id !== null
      );

      if (!negotiated_price.length) {
        this.toast({ title: "Please enter negotiated prices", type: "danger" });

        return;
      }

      const negotiated_prices = negotiated_price.map((p) => p.negotiated_price);
      const vendor_ids = negotiated_price.map((p) => p.vendor_id);
      const invoice_validity = negotiated_price.map((p) => p.invoice_validity);
      const comments = negotiated_price.map((p) => p.comments);

      this.submittingSuggestion = true;

      console.log("all the cost", negotiated_price, negotiated_prices);

      try {
        await this.$axios.post("/tender-processes/suggest-price", {
          tender_process_id: this.tenderProcess.id,
          negotiated_prices,
          invoice_validity,
          comments,
          vendor_ids
        });

        this.toast({ title: "Suggestion Saved", type: "success" });

        this.setTenderProcess(this.$route.query.id);

        this.showSuggested = false;
        this.submittingSuggestion = false;
        this.confirmNegotiation = false;
      } catch (error) {
        this.submittingSuggestion = false;

        this.toast({
          type: "danger",
          title:
            error?.response?.data.message ||
            "Network Error. Please Contact Support"
        });
      }
    },
    getCurrency(items) {
      var i = 0;

      while (!this.thisOrThat(items[i], ["material", "service"])) {
        i++;
      }

      return this.thisOrThat(items[i], ["material", "service"]);
    },
    autoFillVendorSelection() {
      this.items = this.items.map((item) => {
        const matchingQuotationItem = item.quotationItems.find(
          (quotationItem) => quotationItem.quotation_id == this.quotationId
        );
        item.quotationItem = matchingQuotationItem || item.quotationItem;

        // console.log("hello..", item.quotationItem);

        // console.log("chart..", item);

        this.vendorData = item.quotationItem.quotation.vendor.business_name;
        return item;
      });

      this.itemList = this.items;

      // console.log("free service..", this.itemList);
    },
    populateItems() {
      this.items = [];
      for (const item of this.tenderProcess.items) {
        // console.log("first item", item);
        // this.vendorData = item.quotationItem.quotation.vendor.business_name;
        const quotationItem = orderBy(
          item.quotationItems,
          ["price"],
          ["asc"]
        )[0];
        this.items.push(Object.assign({ quotationItem }, item));
      }

      // this.itemList = this.items;

      // console.log("prince", this.items);
    },
    async setTenderProcess(id) {
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

      try {
        const tenderProcess = (
          await this.$axios.get("tender-processes/" + id, {
            params: {
              associations: [
                "items.material.currency",
                "items.service.currency",
                "items.quotationItems.quotation.vendor",
                "quotations.createdBy",
                "quotations.currency",
                "quotations.vendor",
                // "negotiatedPrices",
                // "negotiatedPrices.vendor",
                "status",
                "rfqs",
                "salesOrders.workRequests",
                "salesOrders.workRequests.sla",
                "sla"
              ]
            }
          })
        ).data.tenderProcess;

        // console.log("vendors..", tenderProcess);

        // this.$store.commit(
        //   "hagul/purchase/tenderProcesses/setTenderProcess",
        //   tenderProcess
        // );
        this.tenderProcess = this.tenderProcess
          ? Object.assign({}, tenderProcess)
          : tenderProcess;
        this.populateItems();
        this.loading = false;
        this.shouldRefresh = false;
        // this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async getWorkRequests() {
      var { detailedAssociations, workRequests, pagination, refresh } =
        this.$store.state.maintenance.workRequests;
      const { page, perPage } = pagination;

      if (refresh == false) {
        this.workRequestsLoading = false;
        return (this.workRequests = workRequests);
      }
      try {
        console.log("item ");
        const response = await this.$axios.get("work-requests/" + 67, {
          params: {
            associations: detailedAssociations
          }
        });

        this.workRequests = response.data.workRequest;
        this.workRequestsLoading = false;

        // console.log("first");
        // console.log(
        //   "job request..",
        //   this.workRequests,
        //   response.data.workRequest
        // );

        return true;
      } catch (error) {
        console.log(error);
      }
    },
    editSelection(){
      // if (!this.validateForm("vendor-selection-form")) return false;

      this.disabled = true;
      this.loadingData = true;
      const tender_process_id = this.tenderProcess.id;
      const tender_process_item_id = this.items.map(item => item.id);
      const quotation_item_id = this.items.map(item => item.quotationItem.id);

      const items = this.items;

      console.log("this ..", items, "close..", tender_process_item_id, "quotation..", quotation_item_id);

      this.$axios.post("quotations/edit-price", { quotation_item_id, items })
        .then(response => {
          this.disabled = false;
          this.closeModal("vendor-selection-modal");
          this.confirmNegotiation = false;
          this.loadingData = false;
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          if (response?.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {
            console.log(response);
          }
        });

    },
    submitSelection() {
      if (!this.validateForm("vendor-selection-form")) return false;

      this.disabled = true;
      const tender_process_id = this.tenderProcess.id;
      const tender_process_item_id = this.items.map(item => item.id);
      const quotation_item_id = this.items.map(item => item.quotationItem.id);

      this.$axios
        .post("tender-processes/select-vendors", {
          tender_process_id,
          tender_process_item_id,
          quotation_item_id
        })
        .then(response => {
          this.disabled = false;
          this.closeModal("vendor-selection-modal");
          this.$router.push(
            `/hagul/purchase/tender-processes/details/bidding?id=${this.tenderProcess.id}`
          );
        })
        .catch(error => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          if (response?.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {
            console.log(response);
          }
        });
    }
  
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setTenderProcess(to.query.id);
    },
    showSuggested(show) {
      if (show) {
        setTimeout(() => {
          this.showSuggested = true;
        }, 500);
      }
    }
    // selectedVendor(vendor) {}
  }
};
</script>

<style scoped>
.form {
  text-align: center;
}

.input {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input input {
  width: 90% !important;
}

.input select {
  width: 90% !important;
}
</style>
