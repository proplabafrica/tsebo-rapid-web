<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/purchase-orders">Purchase Orders</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="purchaseOrder ? `#${purchaseOrder.code}` : 'Purchase Order Details'
          "></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="purchaseOrder
          ? `Purchase Order #${purchaseOrder.code}`
          : 'Purchase Order Details'
          "></h6>
    </div>
    <!-- slim-pageheader -->
    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body">
                <div class="row">
                  <div class="col">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Vendor:</span>
                      <nuxt-link :to="`/hagul/vendors/details?id=${purchaseOrder.vendor.id}`"
                        class="tx-medium tx-inverse" v-text="purchaseOrder.vendor.business_name"></nuxt-link>
                    </div>
                    <!-- media -->
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Created by:</span>
                      <nuxt-link :to="`/people/users/details?id=${purchaseOrder.createdBy.id}`"
                        class="tx-medium tx-inverse" v-text="purchaseOrder.createdBy.name"></nuxt-link>
                    </div>
                    <!-- media -->
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Status:</span>
                      <span class="tx-inverse" v-text="purchaseOrder.status.name"></span>
                    </div>

                    <!-- media -->
                  </div>
                  <!-- col -->
                  <div class="col">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Bid:</span>
                      <nuxt-link class="tx-inverse"
                        :to="`/hagul/purchase/tender-processes/details/bidding?id=${purchaseOrder.quotation.tenderProcess.id}`"
                        v-text="purchaseOrder.quotation.tenderProcess.code"></nuxt-link>
                    </div>
                    <div v-for="(salesOrder, index) in purchaseOrder.quotation
          .tenderProcess.salesOrders" :key="salesOrder.id">
                      <span class="d-block">
                        <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Sales Order:</span>
                        <nuxt-link class="tx-inverse"
                          :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`">#{{ salesOrder.code }}
                          {{
          purchaseOrder.quotation.tenderProcess.salesOrders
            .length >
            index + 1
            ? ", "
            : ""
        }}</nuxt-link>
                      </span>
                      <span class="d-block" v-if="salesOrder.workRequests.length > 0">
                        <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Work Request:</span>
                        <nuxt-link class="tx-inverse" v-for="(
                            workRequest, index
                          ) in salesOrder.workRequests" :key="workRequest.id"
                          :to="`/maintenance/requests/details?id=${workRequest.id}`">{{ workRequest.name
                          }}{{
          index + 1 >= salesOrder.workRequests.length
            ? ""
            : ", "
        }}</nuxt-link>
                      </span>
                    </div>
                    <!-- media -->
                    <div class="media mg-t-10">
                      <nuxt-link class="btn btn-primary bd-0 pd-x-25 mg-r-10"
                        :to="`/hagul/purchase/purchase-orders/print?id=${purchaseOrder.id}`">
                        <i class="icon ion-ios-printer-outline"></i> PRINT
                      </nuxt-link>
                      <rate class="mg-r-10" v-if="purchaseOrder.status.code == 'delivered'"
                        :purchaseOrder="purchaseOrder" @update="updatePurchaseOrder()" />
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
                  <div class="col">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Supporting Docs:</span>

                      <span v-if="purchaseOrder.quotation.docLinks.length">
                        <ul class="list-group" style="list-style: disc !important;"
                          v-for="doc in purchaseOrder.quotation.docLinks" :key="doc.id">
                          <li class="list-group-item bd-0 pd-0-force">
                            <a :href="doc.link" target="_blank" :title="doc.link">
                              <span>{{ doc.name }}</span>
                            </a>
                          </li>
                        </ul>
                      </span>
                      <span v-else>
                        <p class="tx-inverse">N/A</p>
                      </span>
                    </div>

                    <form>
                      <!-- <label for="supporting" class="form-control-label mg-t-5 text-black"> Add Document </label> -->
                      <span class="tx-bold tx-14 tx-gray-700 mg-t-5">Add Document:</span>

                      <div>

                        <input class="form-control wd-200  mg-b-3" type="text" name="document_name"
                          placeholder="Document name" id="supporting" v-model="purchaseOrderDocument.name" required />
                      </div>
                      <div>

                        <input class="form-control wd-200  mg-b-0" type="text" name="document_link"
                          placeholder="Document link" id="supporting" v-model="purchaseOrderDocument.link" required />
                      </div>
                      <v-button :disabled="purchaseOrderDocumentsLoading" @click="saveDocumentLink()"
                        class="btn btn-primary mg-l-5 mg-t-5">SAVE</v-button>
                      <!-- <input placeholder="Add supporting doc" /> -->
                    </form>
                    <!-- media -->
                  </div>
                  <!-- col -->
                </div>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- card-body -->
        </div>
        <!-- card -->

        <ul class="nav nav-activity-profile">
          <li class="nav-item">
            <nuxt-link :to="`/hagul/purchase/purchase-orders/details?id=${purchaseOrder.id}`" class="nav-link"
              active-class="active">
              <i class="icon ion-ios-list-outline tx-primary"></i> Costing
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link v-action-show="'purchase-orders.delivery-logs.store-many'"
              :to="`/hagul/purchase/purchase-orders/details/delivery?id=${purchaseOrder.id}`" class="nav-link"
              exact-active-class="active" :class="{
          active: currentActiveRoutes.includes(
            'purchase-order-details-index'
          )
        }">
              <i class="icon ion-android-done-all tx-primary"></i> Delivery
            </nuxt-link>
          </li>
          <li class="nav-item" v-if="false">
            <nuxt-link :to="`/hagul/purchase/purchase-orders/details/payment${purchaseOrder.paymentSchedules.length < 1 ? '/create' : ''
          }?id=${purchaseOrder.id}`" class="nav-link" active-class="active">
              <i class="icon ion-cash tx-primary"></i> Payment
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link :to="`/hagul/purchase/purchase-orders/details/activity-log?id=${purchaseOrder.id}`"
              class="nav-link" active-class="active">
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :purchaseOrder="purchaseOrder" @update="updatePurchaseOrder()" />
      </div>
      <!-- col -->

      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="purchaseOrder.logs" />
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import peopleTrail from "@/components/ui/people-trail";
import rate from "@/components/hagul/purchase/purchase-orders/rate";
import authMixin from "@/mixins/hagul/auth";
import layoutMixin from "@/mixins/layout";
import vButton from "@/components/ui/v-button";

export default {
  components: { loading, peopleTrail, rate, vButton },
  created() {
    this.setPurchaseOrder(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    purchaseOrder: null,
    shouldRefresh: true,
    purchaseOrderDocument: {
      name: "",
      link: ""
    },
    purchaseOrderDocumentsLoading: false
  }),
  head: () => ({
    title: "Purchase Order Details · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.show"
  },
  methods: {
    setPurchaseOrder(id) {
      const { detailedAssociations, purchaseOrders } =
        this.$store.state.hagul.purchase.purchaseOrders;
      this.purchaseOrder = purchaseOrders.find(
        (purchaseOrder) => purchaseOrder.id == id
      );
      if (this.purchaseOrder && !this.shouldRefresh) {
        if (Array.isArray(this.purchaseOrder.items)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("purchase-orders/" + id, {
          params: { associations: detailedAssociations }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/purchase/purchaseOrders/setPurchaseOrder",
            response.data.purchaseOrder
          );
          this.purchaseOrder = this.purchaseOrder
            ? Object.assign({}, response.data.purchaseOrder)
            : response.data.purchaseOrder;
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updatePurchaseOrder() {
      this.shouldRefresh = true;
      this.setPurchaseOrder(this.purchaseOrder.id);
    },
    saveDocumentLink() {


      if (this.purchaseOrderDocument.name && this.purchaseOrderDocument.link) {
        this.$axios.post("purchase-order-document-links", {
          name: this.purchaseOrderDocument.name,
          link: this.purchaseOrderDocument.link,
          quotation_id: this.purchaseOrder.quotation_id
        }).then(async () => {
          this.purchaseOrderDocumentsLoading = true;
          location.reload()
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

  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, layoutMixin],
  watch: {
    $route(to, from) {
      this.setPurchaseOrder(to.query.id);
    }
  }
};
</script>
