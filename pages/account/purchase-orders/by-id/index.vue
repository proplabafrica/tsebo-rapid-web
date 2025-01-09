<template>
  <div class="slim-mainpanel">
    <div class="container" v-if="purchaseOrder && Object.keys(purchaseOrder).length">
      <div class="slim-pageheader">
        <ol class="breadcrumb slim-breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/account/purchase-orders">Purchase Orders</nuxt-link>
          </li>
          <li aria-current="page" class="breadcrumb-item active" v-if="Object.keys(purchaseOrder).length">
            Purchase Order #{{ purchaseOrder.code }}
          </li>
        </ol>
        <h6 class="slim-pagetitle">Purchase Order #{{ purchaseOrder.code }}</h6>
      </div>
      <div class="row row-sm row-timeline" v-if="!purchaseOrderLoading">
        <div class="col-lg-9">
          <div class="card card-profile">
            <div class="card-body">
              <div class="media">
                <div class="media-body row">
                  <div class="col-sm-6">
                    <p class="card-profile-position">
                      <b>Code:</b> #{{ purchaseOrder.code }}
                    </p>
                    <p class="card-profile-position">
                      <b>Created At: </b>
                      <a href="#">
                        {{ purchaseOrder.created_at | dateFormat }}
                      </a>
                    </p>
                    <p class="card-profile-position">
                      <b>Vendor: </b>
                      <a href="#" class="tx-inverse">
                        {{ purchaseOrder.vendor.business_name }}
                      </a>
                    </p>
                    <p class="card-profile-position">
                      <b>Amount:</b>
                      {{
      purchaseOrderTotalWithModifiers(purchaseOrder) | money
    }}
                    </p>
                    <p v-if="amountToPay > 0" class="card-profile-position">
                      <b>Payment Balance:</b>
                      {{ amountToPay | money }}
                    </p>
                    <p v-else class="card-profile-position">
                      <b>Payment Balance:</b>
                      &#8358;{{ amountToPay }}
                    </p>
                    <p class="card-profile-position" v-if="purchaseOrderStatuses.length">
                      <b>Status:</b>
                      {{
      purchaseOrderStatuses.find(
        (status) => purchaseOrder.status_id === status.id
      ).title
    }}
                    </p>
                    <p class="card-profile-position">
                      <b>Terms:</b> {{ purchaseOrderTerms }}
                    </p>
                    <p v-for="file in purchaseOrder.quotation.files" :key="file.id">
                      <a :href="fileUrl" target="_blank" class="btn btn-sm btn-primary"><i
                          class="icon ion-android-attach"></i> Attachment
                      </a>
                    </p>
                  </div>
                  <div class="col-sm-6">
                    <p class="card-profile-position">
                      <b>Description:</b>
                      {{
      workRequestDescription ||
      poWorkRequests(purchaseOrder)[0].description ||
      poWorkRequests(purchaseOrder)[0].name
    }}
                    </p>
                    <div class="form-group mg-md-l--1">
                      <p class="card-profile-position">
                        <b>Supporting Docs: </b>
                        <span v-if="purchaseOrder.quotation.docLinks.length">
                          <ul class="list-group" style="list-style: disc !important;" v-for="doc in purchaseOrder.quotation.docLinks" :key="doc.id">
                            <li class="list-group-item bd-0 pd-0-force">
                              <a :href="doc.link" target="_blank" :title="doc.link">
                                <span>{{ doc.name }}</span>
                              </a>
                            </li>
                          </ul>
                        </span>
                        <span v-else class="tx-inverse">N/A</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card pd-30">
            <nuxt-child />
            <div class="timeline-group">
              <div class="timeline-item" v-for="log in purchaseOrder.logs" :key="log.id">
                <div class="timeline-time">
                  {{ log.created_at | dateFormat }}
                </div>
                <div class="timeline-body">
                  <p class="timeline-title">{{ log.comment.title }}</p>
                  <p class="timeline-author">
                    <a href="#">{{ log.updated_at | timeFormat }} </a>
                    <nuxt-link :to="`/users/${log.createdBy.id}`" class="tx-inverse">{{ " " }} {{ log.createdBy.name
                      }}</nuxt-link>
                    {{ log.createdBy.roles[0].name ?? "System Admin" }}
                  </p>
                  <p class="timeline-text" v-if="log.comment.text">
                    {{ log.comment.text }}
                  </p>
                </div>
              </div>
              <div class="timeline-item timeline-day">
                <div class="timeline-time">&nbsp;</div>
                <div class="timeline-body" v-if="purchaseOrderStatuses.length">
                  <p class="timeline-title timeline-title-button" v-if="purchaseOrderStatus.code === 'PO-CREATED'">
                    <mark-as-posted-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrderId="purchaseOrder.id"
                      @updated="updatePurchaseOrder()" />
                    <nuxt-link :to="`/account/purchase-orders/edit?id=${purchaseOrder.id}`"
                      class="btn btn-sm btn-primary" style="color: #fff !important"><i class="fa fa-edit"></i> EDIT
                    </nuxt-link>
                    <terminate-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrderId="purchaseOrder.id"
                      @updated="updatePurchaseOrder()" />
                  </p>
                  <p class="timeline-title timeline-title-button" v-else-if="purchaseOrderStatus.code === 'PO-POSTED'">
                    <undo-posting-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrderId="purchaseOrder.id"
                      @updated="updatePurchaseOrder()" />
                    <record-payment-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrder="purchaseOrder"
                      :amountToPay="amountToPay" @updated="updatePurchaseOrder()" />
                    <a :href="fileUrl" download target="_blank" class="text-white btn btn-sm btn-primary"><i
                        class="icon ion-printer"></i> PRINT</a>
                  </p>
                  <p class="timeline-title timeline-title-button" v-else-if="purchaseOrder.total &&
      purchaseOrderStatus.code === 'PO-PART-PAY' &&
      amountPaid <
      purchaseOrderTotalWithModifiers(purchaseOrder)
      ">
                    <record-payment-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrder="purchaseOrder"
                      :amountToPay="amountToPay" @updated="updatePurchaseOrder()" />
                    <a :href="fileUrl" target="_blank" class="text-white btn btn-sm btn-primary" v-if="fileUrl"><i
                        class="icon ion-printer"></i> PRINT</a>
                  </p>
                  <p class="timeline-title timeline-title-button" v-else-if="purchaseOrder.total &&
      purchaseOrderStatus.code === 'PO-PAID' &&
      amountPaid >=
      purchaseOrderTotalWithModifiers(purchaseOrder)
      ">
                    <!-- <v-button data-toggle="modal" class="btn btn-sm btn-primary"> -->
                    <a :href="fileUrl" target="_blank" class="text-white btn btn-sm btn-primary"><i
                        class="icon ion-printer"></i> PRINT</a>
                    <!-- </v-button> -->
                  </p>
                  <p class="timeline-title timeline-title-button" v-else-if="purchaseOrderStatus.code === 'PO-XX'">
                    <reactivate-modal v-if="Object.keys(purchaseOrder).length" :purchaseOrderId="purchaseOrder.id"
                      @updated="updatePurchaseOrder()" />
                    <!-- <v-button data-toggle="modal" class="btn btn-sm btn-primary"> -->
                    <a :href="fileUrl" target="_blank" class="text-white btn btn-sm btn-primary"><i
                        class="icon ion-printer"></i> PRINT</a>
                    <!-- </v-button> -->
                  </p>
                  <p class="timeline-title timeline-title-button" v-else>
                    <!-- <v-button data-toggle="modal" class="btn btn-sm btn-primary"> -->
                    <a :href="fileUrl" target="_blank" class="text-white btn btn-sm btn-primary"><i
                        class="icon ion-printer"></i> PRINT</a>
                    <!-- </v-button> -->
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- peoples trail -->
        <div class="col-lg-3 mg-t-20 mg-lg-t-0">
          <div class="card card-people-list pd-20">
            <label class="slim-card-title">People Trail</label>
            <people-trail :logs="purchaseOrder.logs" />
          </div>
        </div>
      </div>
      <loading v-else-if="purchaseOrderLoading" />
    </div>
    <loading v-else />

  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/account/auth";
import formMixin from "@/mixins/forms";

export default {
  components: {
    loading,
    vButton,
    vPaginate,
    vModal,
    "people-trail": () => import("@/components/ui/people-trail"),
    "mark-as-posted-modal": () =>
      import("@/components/account/mark-as-posted-modal"),
    "undo-posting-modal": () =>
      import("@/components/account/undo-posting-modal"),
    "terminate-modal": () => import("@/components/account/terminate-modal"),
    "reactivate-modal": () => import("@/components/account/reactivate-modal"),
    "record-payment-modal": () =>
      import("@/components/account/record-payment-modal")
  },
  created() {
    this.setPurchaseOrder(this.$route.query.id);
    this.getPurchaseOrderStatuses();
  },
  mounted() {
    this.setPurchaseOrder(this.$route.query.id);
    this.getPurchaseOrderStatuses();
  },
  data: () => ({
    purchaseOrder: null,
    purchaseOrderLoading: false,
    purchaseOrderStatuses: [],
    shouldRefresh: false,
    users: [],
    user: null,
    userId: null,
    logs: [],
    purchaseOrderId: null,
    description: null,
    modalLoading: false,
  }),
  methods: {
    poWorkRequests(purchaseOrder) {
      const purchaseOrderItems = purchaseOrder.items ? purchaseOrder.items : [];
      let workRequests = null;
      for (let i = 0; i < purchaseOrderItems.length; i++) {
        if (purchaseOrder.id === purchaseOrderItems[i].purchase_order_id) {
          const salesOrders =
            purchaseOrder?.quotation?.tenderProcess?.salesOrders;
          workRequests = salesOrders?.[0]?.workRequests;
        }
      }
      return workRequests;
    },
    async setPurchaseOrder(id) {
      this.purchaseOrderLoading = true;
      const { detailedAssociations, purchaseOrders } =
        this.$store.state.hagul.purchase.purchaseOrders;

      this.purchaseOrder = purchaseOrders.find(
        (purchaseOrder) => purchaseOrder.id == id
      );

      if (this.purchaseOrder && !this.shouldRefresh)
        return (this.purchaseOrderLoading = false);

      try {
        const purchaseOrder = (
          await this.$axios.get("purchase-orders/" + id, {
            params: { associations: detailedAssociations }
          })
        ).data.purchaseOrder;

        this.$store.commit("hagul/purchase/setPurchaseOrder", purchaseOrder);
        this.purchaseOrder = this.purchaseOrder
          ? Object.assign({}, purchaseOrder)
          : purchaseOrder;

        this.purchaseOrderLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async getPurchaseOrderStatuses() {
      const response = await this.$axios.get("purchase-order-statuses");
      this.purchaseOrderStatuses = response.data.data;
    },
    updatePurchaseOrder() {
      this.shouldRefresh = true;
      this.setPurchaseOrder(this.$route.query.id);
    },
    purchaseOrderTotalWithModifiers(purchaseOrder) {
      return purchaseOrder.modifiers.length === 0
        ? purchaseOrder.total
        : purchaseOrder.modifiers.reduce((acc, item) => {
          if (item.credit && item.credit > 0) {
            return acc + item.credit;
          } else if (item.debit && item.debit > 0) {
            return acc - item.debit;
          }
        }, purchaseOrder.total);
    }
  },
  computed: {
    fileUrl() {
      if (Object.keys(this.purchaseOrder).length === 0) return "";

      const purchaseOrderQuotation = this.purchaseOrder.quotation;
      return purchaseOrderQuotation.files.length
        ? purchaseOrderQuotation.files[purchaseOrderQuotation.files.length - 1]
          .file_path
        : "";
    },
    purchaseOrderTerms() {
      if (Object.keys(this.purchaseOrder).length === 0) return "";
      return Object.keys(this.purchaseOrder.terms).length
        ? this.purchaseOrder.terms.text
        : "";
    },
    amountPaid() {
      let amount_paid = 0;
      if (Object.keys(this.purchaseOrder).length === 0) return 0;
      this.purchaseOrder.transactions.forEach((transaction) => {
        let balance = transaction.credit - transaction.debit;
        amount_paid += balance;
      });
      return amount_paid;
    },
    amountToPay() {
      if (Object.keys(this.purchaseOrder).length === 0 && this.amountPaid === 0)
        return 0;
      return this.purchaseOrder.modifiers.length === 0
        ? this.purchaseOrder.total - this.amountPaid
        : this.purchaseOrder.modifiers.reduce((acc, item) => {
          if (item.credit && item.credit > 0) {
            return acc + item.credit;
          } else if (item.debit && item.debit > 0) {
            return acc - item.debit;
          }
        }, this.purchaseOrder.total - this.amountPaid);
    },
    maxAmountValue() {
      if (Object.keys(this.purchaseOrder).length === 0) return 0;
      if (this.amountPaid === 0) return this.purchaseOrder.total;
      return this.purchaseOrder.total - this.amountPaid;
    },
    workRequestDescription() {
      if (Object.keys(this.purchaseOrder).length === 0 && this.amountPaid === 0)
        return "";

      let work_request_description;

      const work_requests = this.purchaseOrder.quotation?.tenderProcess?.workRequests?.length ? this.purchaseOrder.quotation.tenderProcess.workRequests : this.purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests
      if (work_requests?.length) {
        for (
          let index = 0;
          index <
          work_requests.length;
          index++
        ) {


          const hagulWorkRequest = work_requests[index];
          work_request_description = hagulWorkRequest?.description ? hagulWorkRequest.description : hagulWorkRequest?.name

        }
      }



      return work_request_description;
    },
    purchaseOrderStatus() {
      if (
        Object.keys(this.purchaseOrder).length === 0 &&
        this.purchaseOrderStatuses.length === 0
      )
        return null;

      return this.purchaseOrderStatuses.find(
        (status) => this.purchaseOrder.status_id === status.id
      );
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to) {
      return this.setPurchaseOrder(to.query.id);
    }
  }
};
</script>
