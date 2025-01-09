<template>
  <v-paginate class="col mg-t-10" :list="services" perPage="30">
    <template v-slot="paginate">
      <div class="row" v-if="paginate.list.length > 0">
        <div
          class="col-md-6 col-lg-4 pd-md-0"
          v-for="service in paginate.list"
          :key="service.id"
        >
          <ul class="list-group">
            <li class="list-group-item ht-100">
              <p class="mg-b-0">
                <strong
                  class="tx-inverse tx-medium"
                  v-text="service.name"
                ></strong>
                <span class="d-block">{{
                  { value: service.cost } | toMoney
                }}</span>
                <span class="tx-11 d-block" v-if="service.trades.length > 0">
                  Trades:
                  <span v-for="(trade, index) in service.trades" :key="trade.id"
                    >{{ trade.name
                    }}{{ index + 1 >= service.trades.length ? "" : ", " }}</span
                  >
                </span>
              </p>
            </li>
          </ul>
        </div>
        <!-- col-4 -->
      </div>
      <!-- row -->
      <h4 v-else>No data to display</h4>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
  <!-- v-paginate -->
</template>

<script>
import vPaginate from "@/components/ui/paginate";

export default {
  components: { vPaginate },
  props: ["services"]
};
</script>
