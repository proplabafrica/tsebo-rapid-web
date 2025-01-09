<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/inventory/services">Services</nuxt-link>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
          v-text="`${!serviceLoading ? service.name : 'service Details'}`"
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="`${!serviceLoading ? service.name : 'service Details'}`"
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!serviceLoading">
      <div class="col-md-9">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/inventory/services/details?id=${service.id}`"
              class="nav-link"
              exact-active-class="active"
              >Usage</nuxt-link
            >
          </li>
          <!-- <li class="nav-item">
            <nuxt-link
              class="nav-link"
              active-class="active"
              :to="`/hagul/inventory/services/details/settings?id=${service.id}`"
              >Settings</nuxt-link
            >
          </li> -->
        </ul>
        <nuxt-child :service="service" @update="updateservice()" />
      </div>

      <div class="col-lg-3 mg-t-20 mg-lg-t-0">
        <div class="card pd-25">
          <div class="media-list">
            <div class="media mg-t-25">
              <div>
                <i class="icon ion-ios-information-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Info</h6>
                <span class="d-block tx-inverse" v-if="service.code"
                  >Code: {{ service.code }}</span
                >
                <span class="d-block tx-inverse">
                  Cost:
                  <span
                    v-html="
                      service.currency.unicode +
                      $options.filters.moneyFormat(service.cost)
                    "
                  ></span>
                </span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25" v-if="service.trades.length > 0">
              <div >
                <i class="icon ion-paper-airplane tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Trades</h6>
                <div class="d-block tx-inverse">
                  <div
                    class="tx-14 tx-gray-700"
                    v-for="trade in service.trades"
                    :key="trade.id"
                    >{{ trade.name
                    }}</div
                  >
                </div>
              </div>             
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading },
  created() {
    this.setservice(this.$route.query.id);
  },
  data: () => ({
    service: null,
    serviceLoading: true,
    shouldRefresh: true
  }),
  head: () => ({
    title: "service Details · Hagul"
  }),
  meta: {
    pageName: "services.show"
  },
  methods: {
    async setservice(id) {
      const {
        detailedAssociations,
        services
      } = this.$store.state.hagul.inventory.services;
      this.service = services.find((service) => service.id == id);
      if (this.service && !this.shouldRefresh)
        return (this.serviceLoading = false);

      try {
        const service = (
          await this.$axios.get("services/" + id, {
            params: { associations: detailedAssociations }
          })
        ).data.service;

        this.$store.commit("hagul/inventory/services/setservice", service);
        this.service = this.service ? Object.assign({}, service) : service;
        this.serviceLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/inventory/services/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    updateservice() {
      this.shouldRefresh = true;
      this.serviceLoading = true;
      this.setservice(this.service.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setservice(to.query.id);
    }
  }
};
</script>
