<template>
  <v-paginate
    class="bg-white"
    :list="purchaseOrders"
    perPage="50"
    v-if="!purchaseOrderItemsLoading"
  >
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Work Request</th>
              <th>Request Name</th>
              <th>Sla</th>
              <th>Date Requested</th>
            </tr>
          </thead>
          <tr v-for="item in workRequestItem" :key="item.id">
            <td>
              <nuxt-link
                :to="`/maintenance/requests/details?id=${item.id}`"
                class="tx-inverse tx-14 tx-medium d-block"
                v-text="item.code"
              ></nuxt-link>
              <span
                class="d-block tx-12 tx-inverse"
                v-text="item.status.name"
              ></span>
            </td>
            <td>
              <span
                class="d-block tx-12 tx-inverse text-danger w-75"
                v-text="item.name"
              ></span>
            </td>
            <td>
              <span  
                class="d-block tx-12 tx-inverse" 
              >{{item.sla | gapFormat }}</span>
            </td>
            <td>
              <span>{{item.created_at | dateFormat }}</span>
            </td>
          </tr>
          <!-- <div v-if="!purchaseOrderItemsLoading">
              {{item}}
          </div> -->
          <!-- <button :click="getpurchaseOrderItem()">some</button> -->
        </table>
      </div>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
  <!-- v-paginate -->
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getPurchaseOrders(this);
    // this.getPurchaseOrders();
  },
  mounted(){
    this.getPurchaseOrders();
  },
  data: () => ({
    salesOrderItems: [],
    purchaseOrderItemsLoading: true,
    purchaseOrders:[],
    salesOrderItemsLoading:true,
    workRequestItem: [],

  }),
  meta: {
    pageName: "services.show"
  },
  methods: {
    ...mapActions({
        getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    dispatchedAt(salesOrder) {
      const dispatchLog = salesOrder.logs.find(
        (log) => log.status.code == "dispatched"
      );
      return dispatchLog ? dispatchLog.created_at : null;
    },
    async getPurchaseOrders() {
      let salesOrderArray = [];
      let workRequestArray = [];
      let quotationArray = [];
      let workFlowArray = [];

      this.purchaseOrderItemsLoading = true;
      try {
        this.purchaseOrders = (
          await this.$axios.get("purchase-orders", {
            params: {
              associations: ["createdBy.roles",
              "currency",
              "status",
              "quotation.tenderProcess.salesOrders.workRequests",
              "quotation.tenderProcess.salesOrders.workRequests.status",
              "quotation.tenderProcess.salesOrders.workRequests.logs.status",
              "quotation.tenderProcess.salesOrders.workRequests.priority",
              "quotation.tenderProcess.salesOrders.workRequests.sla.measurement",
              "quotation.tenderProcess.salesOrders.workRequests.sla.priority",
              "quotation.tenderProcess.salesOrders.workRequests.unit",
              "vendor"],
            }
          })
          ).data.data;
        // this.purchaseOrders = response.data.data;
        // "better life .........", this.purchaseOrders)
      
     
        for (let i = 0; i < this.purchaseOrders.length; i++) {
          if(this.purchaseOrders[i].quotation.tenderProcess.salesOrders.length > 0){
            quotationArray.push(this.purchaseOrders[i].quotation.tenderProcess.salesOrders)
          }
        }

        // "objection..........", quotationArray);

        for (let i = 0; i < quotationArray.length; i++) {
          for (let j = 0; j < i; j++){
            if(quotationArray[i][j]){
              // "oieuweiueui", quotationArray[i][j])
              salesOrderArray.push(quotationArray[i][j])
            }
          }
        }

        for (let i = 0; i < salesOrderArray.length; i++) {
          if(salesOrderArray[i]){
            workRequestArray.push(salesOrderArray[i].workRequests);
            // "oieuweiueui", quotationArray[i][j])
            // "thinking about you... ", workRequestArray);
            // "God DEY FOR NIGERIA.. ", salesOrderArray[i].workRequests);
          }
        }

        for (let i = 0; i < workRequestArray.length; i++) {
          for (let j = 0; j < i; j++){
            if(workRequestArray[i][j]){
              // "oieuweiueui", quotationArray[i][j])
              workFlowArray.push(workRequestArray[i][j])
              // this.workRequestItem.push(workRequestArray[i][j])
            }
          }
        }        
        // "Devin Haney........", workFlowArray);
        // "Ryan Garcia........", this.workRequestItem);
        this.workRequestItem = workFlowArray;
        this.purchaseOrderItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },  
  },
  mixins: [authMixin],
  props: ["service"]
};
</script>
