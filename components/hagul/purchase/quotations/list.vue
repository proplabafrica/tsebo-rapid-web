<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Info</th>
        <th>Submitted</th>
        <th>Status</th>
        <th>Date Created</th>
        <th>Vendor Rating</th>
      </tr>
    </thead>
    <tbody v-if="quotations.length > 0">
      <tr v-for="quotation in quotations" :key="quotation.id">
        <td>
          <nuxt-link
            v-if="quotation.vendor"
            :to="`/hagul/vendors/details?id=${quotation.vendor.id}`"
            class="tx-inverse tx-14 tx-medium d-block"
            v-text="quotation.vendor.business_name"
          ></nuxt-link>
          <span
            class="tx-14 tx-medium"
            v-html="
              quotation.currency.unicode +
              $options.filters.moneyFormat(quotation.total)
            "
          ></span>
          <br />
          <nuxt-link
            v-for="file in quotation.files"
            :key="file.id"
            :to="`/utilities/files/details?id=${file.id}`"
            class="btn btn-sm btn-primary"
          >
            <i class="icon ion-android-attach"></i> Attachment
          </nuxt-link>
        </td>
        <td>
          <span>{{ quotation.created_at | dateFormat }} by</span>
          <nuxt-link
            class="d-block tx-inverse"
            v-text="quotation.createdBy.name"
            :to="`/people/users/details?id=${quotation.createdBy.id}`"
          ></nuxt-link>
          <span
            class="tx-11 d-block"
            v-for="role in quotation.createdBy.roles"
            :key="role.id"
            v-text="role.name"
          ></span>
        </td>
        <td>
          <span class="d-block" v-text="quotation.status.name"></span>
          <nuxt-link
            :to="`/hagul/purchase/quotations/details?id=${quotation.id}`"
            class="btn btn-sm btn-primary"
            v-action-show="'quotations.show'"
          >
            <i class="icon ion-ios-eye"></i> View Quotation
          </nuxt-link>
          <nuxt-link
            v-if="
              quotation.status.code == 'approved' ||
              quotation.status.code == 'vendors-selected'
            "
            :to="
              '/hagul/purchase/purchase-orders/create?quotation-id=' +
              quotation.id
            "
            class="btn btn-sm btn-primary"
            v-action-show="'purchase-orders.store'"
          >
            <i class="icon ion-compose"></i> Create Purchase Order
          </nuxt-link>
          <nuxt-link
            v-if="quotation.status.code == 'po-gen'"
            :to="`/hagul/purchase/purchase-orders/details?id=${quotation.purchaseOrders[0].id}`"
            class="btn btn-sm btn-primary"
            v-action-show="'purchase-orders.show'"
          >
            <i class="icon ion-ios-eye"></i> View Purchase Order
          </nuxt-link>
        </td>
        <td>
          <span>{{ quotation.created_at | dateFormat }}</span>
        </td>
        <td style="width: 20%">
          <span v-if="quotation.vendor_rating">
            <span> </span>
            <starRating
              v-if="quotation.vendor_rating[0].rating"
              :rangeArray="[1, 2, 3, 4, 5]"
              :rating="quotation.vendor_rating[0].rating"
            />
          </span>
          <span v-else class="d-block" v-text="'No rating'"> </span>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="5">
          <h4>No data to display</h4>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import authMixin from "@/mixins/auth";
import starRating from "@/components/ui/star-rating";

export default {
  components: { starRating },

  mixins: [authMixin],
  props: ["quotations"]
};
</script>
