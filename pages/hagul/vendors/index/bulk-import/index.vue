<template>
  <v-paginate :list="vendors" perPage="30">
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th width="25%">Vendor</th>
              <th width="30%">Contact Info</th>
              <th>Trade</th>
              <th>Material Categories</th>
              <th>Bank Details</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="vendor in paginate.list" :key="vendor.id">
              <td>
                <span class="tx-inverse tx-14 tx-medium d-block">
                  <b>Business Name:</b>
                  {{ vendor.business_name }}
                </span>
              </td>
              <td>
                <span class="tx-14 d-block">
                  <b>Rep Name:</b>
                  {{ vendor.rep_name }}
                </span>
                <span class="tx-14 d-block">
                  <b>Phone:</b>
                  {{ vendor.business_phone }}
                </span>
                <span class="tx-14 d-block">
                  <b>Email:</b>
                  {{ vendor.business_email }}
                </span>
                <span class="tx-14 d-block">
                  <b>Address:</b>
                  {{ vendor.address }}
                </span>
              </td>
              <td>
                <span class="tx-14 d-block">
                  <span v-for="(trade, index) in vendor.trades" :key="trade.id"
                    >{{ trade.name
                    }}{{ index + 1 >= vendor.trades.length ? "" : ", " }}</span
                  >
                </span>
              </td>
              <td>
                <span class="tx-14 d-block">
                  <span
                    v-for="(category, index) in vendor.materialCategories"
                    :key="category.id"
                    >{{ category.name
                    }}{{
                      index + 1 >= vendor.materialCategories.length ? "" : ", "
                    }}</span
                  >
                </span>
              </td>
              <td>
                <span class="tx-14 d-block">
                  <b>Acc. Number:</b>
                  {{ vendor.bank_account_number }}
                </span>
                <span class="tx-14 d-block">
                  <b>Bank Name:</b>
                  {{ vendor.bank_name }}
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">
                <h5>No data to display</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
</template>

<script>
import vPaginate from "@/components/ui/paginate";

export default {
  components: { vPaginate },
  props: ["vendors"]
};
</script>
