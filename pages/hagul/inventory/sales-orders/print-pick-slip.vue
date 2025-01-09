<template>
  <body v-if="!loading" style="
        background-color: #fff;
        padding: 20px;
        font-size: 14px;
        line-height: 1.43;
        font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
      ">
    <div style="
          max-width: 100%;
          margin: 0px auto;
          background-color: #fff;
          box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.05);
        ">
      <table style="width: 100%">
        <tr>
          <td style="background-color: #fff; padding-left: 60px">
            <img src="https://res.cloudinary.com/diils/image/upload/v1681624201/tsebo-rapid_voh5bx.png"
              @load="imageLoaded()" alt="Tsebo-Rapid Logo" height="45" />
          </td>
          <td style="padding-left: 50px; text-align: right; padding-right: 20px"></td>
        </tr>
      </table>

      <!-- Header -->
      <div style="padding: 60px 70px">
        <h2 style="margin-top: 0px">Material Pick Slip</h2>
        <div style="color: #636363; font-size: 14px">
          The following items have been dispatched as per your request
        </div>
        <table style="margin-top: 30px; width: 100%">
          <tr>
            <td style="padding-right: 30px">
              <div style="
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 1px;
                    font-weight: bold;
                    color: #b8b8b8;
                    margin-bottom: 5px;
                  ">
                Order #{{ salesOrder.code }}
              </div>
              <div style="
                    font-size: 12px;
                    color: #111;
                    font-weight: bold;
                    margin-bottom: 20px;
                  ">
                {{ dispatchedAt | dateFormat }}
              </div>
              <div style="
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 1px;
                    font-weight: bold;
                    color: #b8b8b8;
                    margin-bottom: 5px;
                  ">
                Location:
              </div>
              <div style="font-size: 12px; color: #111; font-weight: bold" v-for="unit in salesOrder.units"
                :key="unit.id">
                {{ unit.name }}
                <br />
                {{ unit.address.address }}
              </div>
            </td>
            <td style="max-width: 150px"></td>
          </tr>
        </table>

        <table style="margin-top: 40px; width: 100%">
          <tr>
            <td style="
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #b8b8b8;
                  font-size: 10px;
                  font-weight: bold;
                ">
              Item
            </td>
            <td style="
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #b8b8b8;
                  font-size: 10px;
                  font-weight: bold;
                  text-align: right;
                ">
              Quantity
            </td>
          </tr>
          <tr v-for="item in salesOrder.items" :key="item.id">
            <td style="
                  padding: 15px 0px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                ">
              <div style="color: #111; font-size: 14px; font-weight: bold">
                {{ item.material.name }}
              </div>
              <!-- <div style="color: #B8B8B8; font-size: 12px;">Extended license included</div> -->
            </td>
            <td style="
                  padding: 15px 0px;
                  text-align: right;
                  font-size: 14px;
                  font-weight: bold;
                  color: #111;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                ">
              {{ item.quantity }}
            </td>
          </tr>
        </table>
      </div>
      <!-- Body -->
      <div style="background-color: #f5f5f5; padding: 40px; text-align: center">
        <div>
          <div style="color: #a5a5a5; font-size: 10px">
            Copyright 2023 Vampfi. All rights reserved.
          </div>
          <div style="color: #a5a5a5; font-size: 10px; margin-bottom: 5px">
    10 Sam Adegbite Close, Off Amodu Ojikutu Street,
Victoria Island, Lagos. 8A Ogunyemi Road, Oniru, Victoria Island, Lagos, Nigeria
          </div>
        </div>
      </div>
      <!-- footer -->
    </div>
  </body>
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading },
  computed: {
    dispatchedAt() {
      const dispatchLog = this.salesOrder.logs.find(
        (log) => log.status.code == "dispatched"
      );
      if (!dispatchLog) return false;
      return dispatchLog.created_at;
    }
  },
  created() {
    this.setSalesOrder(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    logoLoading: true,
    salesOrder: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Sales Order Details · Hagul"
  }),
  meta: {
    pageName: "sales-orders.show"
  },
  methods: {
    imageLoaded() {
      this.logoLoading = false;
      if (this.loading == false) window.print();
    },
    setSalesOrder(id) {
      const { salesOrders } = this.$store.state.hagul.inventory.salesOrders;
      this.salesOrder = salesOrders.find((salesOrder) => salesOrder.id == id);
      if (this.salesOrder && !this.shouldRefresh) {
        if (Array.isArray(this.salesOrder.items)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("sales-orders/" + id, {
          params: {
            associations: ["items.material", "logs.status", "units.address"]
          }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/inventory/salesOrders/setSalesOrder",
            response.data.salesOrder
          );
          this.salesOrder = this.salesOrder
            ? Object.assign({}, response.data.salesOrder)
            : response.data.salesOrder;
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateSalesOrder() {
      this.shouldRefresh = true;
      this.setSalesOrder(this.salesOrder.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  updated() {
    if (this.loading == false && this.logoLoading == false) window.print();
  },
  watch: {
    $route(to, from) {
      this.setSalesOrder(to.query.id);
    }
  }
};
</script>
