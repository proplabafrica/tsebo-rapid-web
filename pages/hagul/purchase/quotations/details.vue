<template>
  <div class="container" v-if="!loading">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/quotations">Quotations</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          {{ quotation.name || quotation.code }}
        </li>
      </ol>
      <h6 class="slim-pagetitle">
        {{ quotation.name || "Quotation #" + quotation.code }}
      </h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Created By:</span
                      >
                      <nuxt-link
                        class="tx-inverse"
                        :to="`/people/users/details?id=${quotation.createdBy.id}`"
                        v-text="quotation.createdBy.name"
                      ></nuxt-link>
                    </div>
                    <!-- media -->
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Status:</span
                      >
                      <span
                        class="tx-inverse"
                        v-text="quotation.status.name"
                      ></span>
                    </div>
                    <!-- media -->
                  </div>
                  <div class="col-md-6">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Total:</span
                      >
                      <span class="tx-inverse">{{
                        quotation.total | money
                      }}</span>
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
                </div>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- card-body -->
        </div>
        <!-- card -->

        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/purchase/quotations/details?id=${quotation.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-ios-list-outline tx-primary"></i> Items
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child
          :quotation="quotation"
          @update="getQuotation(quotation.id)"
        />
      </div>
      <!-- col -->

      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="[quotation.logs[0]].concat(quotation.prices)" />
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
  </div>
  <!-- container -->
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import peopleTrail from "@/components/ui/people-trail";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, peopleTrail },
  data: () => ({
    loading: true,
    quotation: null
  }),
  head: () => ({
    title: "Quotation Details · Hagul"
  }),
  meta: {
    pageName: "quotations.show"
  },
  methods: {
    async getQuotation(id) {
      this.loading = true;
      try {
        const response = await this.$axios.get(`/quotations/${id}`, {
          params: {
            associations: [
              "createdBy",
              "logs.comment",
              "logs.createdBy",
              "logs.status",
              "items.tenderItem.material",
              "items.tenderItem.service",
              "prices.createdBy",
              "status"
            ]
          }
        });
        this.quotation = response.data.quotation;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.getQuotation(to.query.id);
      }
    }
  }
};
</script>
