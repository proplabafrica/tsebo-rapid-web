<template>
  <div class="card bd-t-0">
    <div class="card-body">
      <div class="media">
        <div class="media-body row">
          <div class="col-sm-6">
            <p
              class="card-profile-position mg-b-10"
              v-if="workRequest.description"
            >
              <b>FM Problem Description:</b>
              <span v-text="workRequest.description"></span>
            </p>
            <p class="card-profile-position mg-b-10">
              <b>Job Type:</b>
              <span
                v-text="workRequest.outsourced == 1 ? 'Outsourced' : 'In-house'"
              ></span>
            </p>
          </div>
          <!-- col-sm-6 -->
          <div class="col-sm-6">
            <p
              class="card-profile-position"
              v-if="workRequest.salesOrders.length > 0"
            >
              <b>Sales Order Code:</b>
              <span
                v-for="salesOrder in workRequest.salesOrders"
                :key="salesOrder.id"
                ><nuxt-link
                  :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`"
                  class="tx-inverse tx-medium"
                  v-text="salesOrder.code"
                ></nuxt-link
              ></span>
            </p>
            <p
              class="card-profile-position"
              v-if="workRequest.tenderProcesses.length > 0"
            >
              <b>Tender Process Code:</b>
              <span
                v-for="tenderProcess in workRequest.tenderProcesses"
                :key="tenderProcess.id"
                >{{ tenderProcess.code }}</span
              >
            </p>
            <p
              class="card-profile-position mg-b-10"
              v-if="workRequest.technicians.length"
            >
              <b>Technician(s):</b>
              <span
                v-for="(technician, index) in workRequest.technicians"
                :key="technician.id"
                >{{ technician.user.name }}
                {{
                  workRequest.technicians.length > index + 1 ? ", " : ""
                }}</span
              >
            </p>
            <p
              class="card-profile-position mg-b-10"
              v-if="workRequest.salesOrders.length"
            >
              <span
                class="d-block"
                v-for="salesOrder in workRequest.salesOrders"
                :key="salesOrder.id"
              >
                <nuxt-link
                  class="btn btn-primary btn-sm bd-0 pd-x-25 mg-x-10"
                  v-if="salesOrderDispatched(salesOrder)"
                  :to="`/hagul/inventory/sales-orders/print-pick-slip?id=${salesOrder.id}`"
                >
                  <i class="icon ion-ios-printer-outline"></i> Print Pick Slip
                </nuxt-link>
              </span>
            </p>
          </div>
          <!-- col-sm-6 -->
        </div>
        <!-- media-body -->
      </div>
      <!-- media -->
      <div class="table-responsive" v-if="workRequest.items.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th class="d-none d-sm-block">#</th>
              <th>Item</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tr v-for="(item, index) in workRequest.items" :key="item.id">
            <td class="d-none d-sm-block">
              <span v-text="index + 1"></span>
            </td>
            <td v-if="item.deliveryType.code == 'material'">
              <span v-text="item.deliveryType.name" class="d-block"></span>
              <nuxt-link
                :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
                class="tx-inverse tx-14 tx-medium d-block"
                v-text="item.material.name"
              ></nuxt-link>
              <span v-if="item.material.code" class="tx-11 d-block"
                >#{{ item.material.code }}</span
              >
              <span v-if="item.material.stock" class="tx-11 d-block"
                >Stock: {{ item.material.stock }}</span
              >
            </td>
            <td v-if="item.deliveryType.code == 'service'">
              <span v-text="item.deliveryType.name" class="d-block"></span>
              <nuxt-link
                :to="`/hagul/inventory/services/details?id=${item.service.id}`"
                class="tx-inverse tx-14 tx-medium d-block"
                v-text="item.service.name"
              ></nuxt-link>
            </td>
            <td>
              <span v-text="item.quantity"></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    salesOrderDispatched(salesOrder) {
      const dispatchLog = salesOrder.logs.find(
        (log) => log.status.code == "dispatched"
      );
      return dispatchLog ? true : false;
    }
  },
  props: ["workRequest"]
};
</script>
