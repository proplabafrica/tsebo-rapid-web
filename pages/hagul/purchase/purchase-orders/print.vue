<template>
  <body v-if="!loading" style="
          background-color: #fff;
          padding: 20px;
          font-size: 14px;
          line-height: 1.43;
          font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
        ">
    <div class="slim-mainpanel" style="
            box-sizing: border-box;
            transition: none;
            min-height: calc(100vh - 263px);
          ">
      <div class="card card-invoice" style="
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
              min-width: 0;
              word-wrap: break-word;
              background-color: #fff;
              background-clip: border-box;
              border: 1px solid #ced4da;
              border-radius: 0;
            ">
        <div class="card-body" style="box-sizing: border-box; flex: 1 1 auto; padding: 60px">
          <div class="invoice-header" style="
                  box-sizing: border-box;
                  display: flex;
                  justify-content: space-between;
                  flex-direction: row-reverse;
                ">
            <h3 class="invoice-title" style="
                    box-sizing: border-box;
                    margin-top: 0;
                    margin-bottom: 0;
                    font-family: Helvetica Neue, Arial, sans-serif;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #ced4da;
                    font-size: 1.5875rem;
                    text-transform: uppercase;
                  ">
              PURCHASE ORDER
            </h3>
            <div class="billed-from" style="box-sizing: border-box; margin-top: 0">
              <img src="https://res.cloudinary.com/diils/image/upload/v1682171434/overcomers/bt5dcfilslfxsprztdty.png" alt="Tsebo Logo" height="45"
                @load="imageLoaded()" />
              <p style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 20px;
                      line-height: 1.7;
                    ">
                 8A Ogunyemi Road, Oniru, Victoria Island, Lagos, Nigeria
                <br style="box-sizing: border-box" />Tel No: +2348100276566
                <br style="box-sizing: border-box" />Email:
             	
procurement@tseborapid.com </p>
            </div>
            <!-- billed-from -->
          </div>
          <!-- invoice-header -->

          <div class="row mg-t-20" style="
                  box-sizing: border-box;
                  display: flex;
                  flex-wrap: wrap;
                  margin-right: -15px;
                  margin-left: -15px;
                  margin-top: 20px;
                ">
            <div class="col-md" style="
                    box-sizing: border-box;
                    position: relative;
                    width: 100%;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex-basis: 0;
                    flex-grow: 1;
                    max-width: 100%;
                  " v-if="purchaseOrder.name">
              <label class="section-label-sm tx-gray-500" style="
                      box-sizing: border-box;
                      display: block;
                      margin-bottom: 0.5rem;
                      font-weight: 700;
                      color: #adb5bd;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                      font-size: 11px;
                    ">Delivery Details</label>
              <div class="billed-to" style="box-sizing: border-box">
                <p style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 20px;
                        line-height: 1.7;
                      ">
                  {{ purchaseOrder.name }}
                </p>
              </div>
            </div>
            <!-- col -->
            <div class="col-md" style="
                    box-sizing: border-box;
                    position: relative;
                    width: 100%;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex-basis: 0;
                    flex-grow: 1;
                    max-width: 100%;
                  ">
              <label class="section-label-sm tx-gray-500" style="
                      box-sizing: border-box;
                      display: block;
                      margin-bottom: 0.5rem;
                      font-weight: 700;
                      color: #adb5bd;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                      font-size: 11px;
                    ">
                Purchase Order Information
              </label>

              <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                <span style="box-sizing: border-box">Purchase Order Number:</span>
                <span style="box-sizing: border-box">{{
                                  purchaseOrder.code
                                  }}</span>
              </p>
              <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                    ">
                <span style="box-sizing: border-box">Vendor Name:</span>
                <span style="box-sizing: border-box">{{
                                  purchaseOrder.vendor.business_name
                                  }}</span>
              </p>
              <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                <span style="box-sizing: border-box">Vendor Tel No:</span>
                <span style="box-sizing: border-box">{{
                                  purchaseOrder.vendor.business_phone
                                  }}</span>
              </p>
              <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                <span style="box-sizing: border-box">Issue Date:</span>
                <span style="box-sizing: border-box">{{
                                  purchaseOrder.created_at | dateFormat
                                  }}</span>
              </p>
            </div>
            <!-- col -->
          </div>
          <!-- row -->

          <div class="table-responsive mg-t-40" style="
                  box-sizing: border-box;
                  display: block;
                  width: 100%;
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                  -ms-overflow-style: -ms-autohiding-scrollbar;
                  margin-top: 40px;
                ">
            <table class="table table-invoice" style="
                    box-sizing: border-box;
                    border-collapse: collapse;
                    width: 100%;
                    max-width: 100%;
                    margin-bottom: 0;
                    background-color: transparent;
                  ">
              <thead style="box-sizing: border-box">
                <tr style="box-sizing: border-box">
                  <th class="wd-20p" style="
                          box-sizing: border-box;
                          text-align: inherit;
                          padding: 0.75rem;
                          vertical-align: bottom;
                          border-top: 0;
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          width: 20%;
                          border-bottom: 0;
                          font-weight: 700;
                          font-size: 12px;
                          text-transform: uppercase;
                          background-color: rgb(192, 0, 0);
                          letter-spacing: 0.5px;
                        ">
                    #
                  </th>
                  <th class="wd-40p" style="
                          box-sizing: border-box;
                          text-align: inherit;
                          padding: 0.75rem;
                          vertical-align: bottom;
                          border-top: 0;
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          width: 40%;
                          border-bottom: 0;
                          font-weight: 700;
                          font-size: 12px;
                          text-transform: uppercase;
                          background-color: rgb(192, 0, 0);
                          letter-spacing: 0.5px;
                        ">
                    Item
                  </th>
                  <th class="tx-center" style="
                          box-sizing: border-box;
                          text-align: center;
                          padding: 0.75rem;
                          vertical-align: bottom;
                          border-top: 0;
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          border-bottom: 0;
                          font-weight: 700;
                          font-size: 12px;
                          text-transform: uppercase;
                          background-color: rgb(192, 0, 0);
                          letter-spacing: 0.5px;
                        ">
                    Quantity
                  </th>
                  <th class="tx-right" style="
                          box-sizing: border-box;
                          text-align: right;
                          padding: 0.75rem;
                          vertical-align: bottom;
                          border-top: 0;
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          border-bottom: 0;
                          font-weight: 700;
                          font-size: 12px;
                          text-transform: uppercase;
                          background-color: rgb(192, 0, 0);
                          letter-spacing: 0.5px;
                        ">
                    Unit Price
                  </th>
                  <th class="tx-right" style="
                          box-sizing: border-box;
                          text-align: right;
                          padding: 0.75rem;
                          vertical-align: bottom;
                          border-top: 0;
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          border-bottom: 0;
                          font-weight: 700;
                          font-size: 12px;
                          text-transform: uppercase;
                          background-color: rgb(192, 0, 0);
                          letter-spacing: 0.5px;
                        ">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody style="box-sizing: border-box">
                <tr style="box-sizing: border-box" v-for="(item, index) in purchaseOrder.items" :key="item.id">
                  <td style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                        ">
                    {{ index + 1 }}
                  </td>
                  <td class="tx-center" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: left;
                        ">
                    {{
                                        item.quotationItem.tenderItem[
                                        item.quotationItem.tenderItem.deliveryType.code
                                        ].name
                                        }}
                  </td>
                  <td class="tx-center" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: center;
                        ">
                    {{ item.quotationItem.tenderItem.quantity }}
                  </td>
                  <td class="tx-right" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: right;
                        ">
                    {{ { value: item.quotationItem.price } | toMoney }}
                  </td>
                  <td class="tx-right" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: right;
                        ">
                    {{
                                        {
                                        value:
                                        parseFloat(item.quotationItem.tenderItem.quantity) *
                                        parseFloat(item.quotationItem.price)
                                        } | toMoney
                                        }}
                  </td>
                </tr>
                <tr style="box-sizing: border-box">
                  <td colspan="2" rowspan="4" class="valign-middle" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: middle;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                        ">
                    <div class="invoice-notes" style="box-sizing: border-box">
                      <label class="section-label-sm tx-gray-500" style="
                              box-sizing: border-box;
                              display: block;
                              margin-bottom: 0.5rem;
                              font-weight: 700;
                              color: #adb5bd;
                              text-transform: uppercase;
                              letter-spacing: 1px;
                              font-size: 11px;
                            ">
                        DELIVERY AND PAYMENT TERMS
                      </label>
                      <p style="
                              box-sizing: border-box;
                              margin-top: 0;
                              margin-bottom: 20px;
                            ">
                        {{ purchaseOrder.terms.text }}
                      </p>
                    </div>
                    <!-- invoice-notes -->
                  </td>
                  <td class="tx-right tx-bold tx-inverse" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          font-weight: 700;
                          text-align: right;
                        ">
                    SUB TOTAL
                  </td>
                  <td colspan="2" class="tx-right" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: right;
                        ">
                    {{ { value: purchaseOrder.total } | toMoney }}
                  </td>
                </tr>
                <tr style="box-sizing: border-box">
                  <td class="tx-right tx-uppercase tx-bold tx-inverse" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #343a40;
                          font-weight: 700;
                          text-transform: uppercase;
                          text-align: right;
                        ">
                    Total Due
                  </td>
                  <td colspan="2" class="tx-right" style="
                          box-sizing: border-box;
                          padding: 0.75rem;
                          vertical-align: top;
                          border-top: 1px solid rgb(192, 0, 0);
                          border-top-color: rgb(192, 0, 0);
                          color: #5b636a;
                          text-align: right;
                        ">
                    <h4 class="tx-primary tx-bold tx-lato" style="
                            box-sizing: border-box;
                            margin-top: 0;
                            margin-bottom: 0.5rem;
                            font-family: Helvetica Neue, Arial, sans-serif;
                            font-weight: 700;
                            line-height: 1.2;
                            color: rgb(192, 0, 0);
                            font-size: 1.3125rem;
                          ">
                      {{ { value: purchaseOrder.total } | toMoney }}
                    </h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- table-responsive -->

          <hr class="mg-b-60" style="
                  box-sizing: content-box;
                  height: 0;
                  overflow: visible;
                  margin-top: 1rem;
                  margin-bottom: 60px;
                  border: 0;
                  border-top: 1px solid rgba(0, 0, 0, 0.1);
                " />
          <!-- <a href="" class="btn btn-primary btn-block">Pay Now</a> -->
        </div>
        <!-- card-body -->
      </div>
      <!-- card -->
    </div>
    <!-- slim-mainpanel -->

    <div class="slim-footer" style="
            box-sizing: border-box;
            border-top: 1px solid #ced4da;
            background-color: #e3e7eb;
            margin-top: 50px;
            padding: 0;
          ">
      <div class="container" style="
              box-sizing: border-box;
              width: 100%;
              padding-right: 15px;
              padding-left: 15px;
              margin-right: auto;
              margin-left: auto;
              max-width: 1140px;
              font-size: 13px;
              text-align: left;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            ">
        <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0">
          Copyright 2023 &copy; All Rights Reserved. Vampfi
        </p>
        <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0">
          Designed by:
          <a href="https://vampfi.com/" style="
                  box-sizing: border-box;
                  color: rgb(192, 0, 0);
                  text-decoration: none;
                  background-color: transparent;
                  -webkit-text-decoration-skip: objects;
                  transition: none;
                ">Vampfi</a>
        </p>
      </div>
      <!-- container -->
    </div>
    <!-- slim-footer -->
  </body>
</template>

<script>
import authMixin from "@/mixins/hagul/auth";
import layoutMixin from "@/mixins/layout";

export default {
  created() {
    this.setPurchaseOrder(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    logoLoading: true,
    purchaseOrder: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Purchase Order · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.show"
  },
  methods: {
    imageLoaded() {
      this.logoLoading = false;
      if (this.loading == false) window.print();
    },
    setPurchaseOrder(id) {
      const {
        detailedAssociations,
        purchaseOrders
      } = this.$store.state.hagul.purchase.purchaseOrders;
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
    }
  },
  middleware: ["auth", "roleGuard"],
  updated() {
    if (this.loading == false && this.logoLoading == false) window.print();
  },
  watch: {
    $route(to, from) {
      this.setPurchaseOrder(to.query.id);
    }
  }
};
</script>
