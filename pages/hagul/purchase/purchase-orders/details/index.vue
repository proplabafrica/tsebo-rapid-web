<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th class="tx-right">Unit Price</th>
          <th class="tx-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purchaseOrder.items" :key="item.id">
          <td>
            <nuxt-link
              :to="`/hagul/inventory/materials/details?id=${
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].id
              }`"
              class="tx-inverse tx-14 tx-medium"
              v-text="
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              "
            ></nuxt-link>
          </td>
          <td>
            <span v-text="item.quotationItem.tenderItem.quantity"></span>
          </td>
          <td class="tx-right">
            <span
              class="tx-14 tx-medium"
              v-html="
                purchaseOrder.currency.unicode +
                $options.filters.moneyFormat(
                  parseFloat(item.quotationItem.price)
                )
              "
            ></span>
          </td>
          <td class="tx-right">
            <span
              class="tx-14 tx-medium"
              v-html="
                purchaseOrder.currency.unicode +
                $options.filters.moneyFormat(
                  parseFloat(item.quotationItem.tenderItem.quantity) *
                    parseFloat(item.quotationItem.price)
                )
              "
            ></span>
          </td>
        </tr>
        <tr v-if="purchaseOrder.items.length > 0">
          <td colspan="2" rowspan="4" class="valign-middle"></td>
          <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
            Total
          </td>
          <td colspan="1" class="tx-right">
            <h4
              class="tx-primary tx-bold tx-lato"
              v-html="
                purchaseOrder.currency.unicode +
                $options.filters.moneyFormat(purchaseOrder.total)
              "
            ></h4>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["purchaseOrder"]
};
</script>
