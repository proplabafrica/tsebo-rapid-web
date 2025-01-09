<template>
  <div class="timeline-group mg-t-10">
    <div class="timeline-item" v-for="log in deliveryLogs" :key="log.id">
      <div class="timeline-time">{{ log.created_at | dateFormat }}</div>
      <div class="timeline-body">
        <p class="timeline-title">
          <nuxt-link
            :to="
              `/hagul/inventory/materials/details?id=${
                thisOrThat(log.item.quotationItem.tenderItem, [
                  'material',
                  'service'
                ]).id
              }`
            "
            class="tx-inverse tx-14 tx-medium"
            v-text="
              thisOrThat(log.item.quotationItem.tenderItem, [
                'material',
                'service'
              ]).name
            "
          ></nuxt-link>
          <span v-text="`X ${log.quantity}`"></span>
        </p>
        <p class="timeline-author">
          <a href="#">{{ log.created_at | timeFormat }}</a>
          <nuxt-link
            :to="`/people/users/details?id=${log.createdBy.id}`"
            class="tx-inverse"
            v-text="log.createdBy.name"
          ></nuxt-link>
        </p>
        <p class="timeline-text">
          <span v-text="log.status.name"></span>
          <star-rating
            class="tx-30"
            :rangeArray="[1, 2, 3, 4, 5]"
            :rating="log.rating"
          />
        </p>
      </div>
      <!-- timeline-body -->
    </div>
    <!-- timeline-item -->
  </div>
  <!-- timeline-group -->
</template>

<script>
import starRating from "@/components/ui/star-rating";

export default {
  components: { starRating },
  computed: {
    deliveryLogs() {
      return this.purchaseOrder.deliveryLogs.map(deliveryLog => {
        deliveryLog.item = this.purchaseOrder.items.find(
          item => item.id == deliveryLog.purchase_order_item_id
        );
        return deliveryLog;
      });
    }
  },
  props: ["purchaseOrder"]
};
</script>
