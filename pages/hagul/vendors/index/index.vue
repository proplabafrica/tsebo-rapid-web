<template>
  <div>
    <div class="mg-y-10">
      <input
        type="text"
        placeholder="Start typing here to search"
        class="form-control search mg-b-10"
        v-model="vendorSearch"
      />
    </div>
    <v-paginate :list="vendors" perPage="30" v-if="!vendorsLoading">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Contact Info</th>
                <th>Trade</th>
                <th>Material Categories</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="vendor in paginate.list" :key="vendor.id">
                <td>
                  <nuxt-link
                    :to="`/hagul/vendors/details?id=${vendor.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                  >
                    {{ vendor.business_name }}
                    <br />
                    <br />
                    <div
                      style="max-width: 120px"
                      v-if="getAvgRating(vendor.ratings)"
                    >
                      <starRating
                        :rangeArray="[1, 2, 3, 4, 5]"
                        :rating="getAvgRating(vendor.ratings)"
                      />
                    </div>
                    <div class="tx-warning" style="font-size: small" v-else>
                      No Ratings
                    </div>
                  </nuxt-link>
                </td>
                <td>
                  <span
                    class="tx-14 d-block"
                    v-text="vendor.business_phone"
                  ></span>
                  <span
                    class="tx-14 d-block"
                    v-text="vendor.business_email"
                  ></span>
                  <span
                    class="tx-14 d-block"
                    v-text="vendor.address.address"
                  ></span>
                </td>
                <td>
                  <span class="tx-14 d-block">
                    <span
                      v-for="(trade, index) in vendor.trades"
                      :key="trade.id"
                      >{{ trade.name
                      }}{{
                        index + 1 >= vendor.trades.length ? "" : ", "
                      }}</span
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
                        index + 1 >= vendor.materialCategories.length
                          ? ""
                          : ", "
                      }}</span
                    >
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
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";
import starRating from "@/components/ui/star-rating";
export default {
  created() {
    this.getVendors(this);
  },
  components: { loading, vPaginate, starRating },
  data: () => ({
    vendorSearch: null,
    vendors: [],
    vendorsLoading: true
  }),
  head: () => ({
    title: "Vendors · Hagul"
  }),
  meta: {
    pageName: "vendors.index"
  },
  methods: {
    ...mapActions({
      getVendors: "people/vendors/getVendors"
    }),
    getAvgRating(ratings) {
      let total_rating = 0;
      if (ratings.length > 0) {
        for (let i = 0; i < ratings.length; i++) {
          total_rating = total_rating + parseInt(ratings[i].rating);
        }

        return parseInt(total_rating / ratings.length);
      } else {
        return null;
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    vendorSearch() {
      this.debounce(() => this.getVendors(this), 500);
    }
  }
};
</script>
