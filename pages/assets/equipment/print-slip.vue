<template>
  <body
    v-if="!loading"
    style="
      background-color: #fff;
      padding: 20px;
      font-size: 14px;
      line-height: 1.43;
      font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
    "
  >
    <div class="media mg-t-25">
      <div class="media-body mg-x-25 mg-t-4">
        <div class="d-flex justify-content-center align-items-center">
          <h2 class="slim-logo">
            <nuxt-link to="/">
              <!-- <img
                :src="
                  authUser.organizations[0].image_path
                    ? authUser.organizations[0].image_path
                    : 'https://landwey.vampfi.com/img/landwey.png'
                "
                :alt="`${authUser.organizations[0].name} Logo`"
              /> -->
              <!-- {{ authUser }} -->
              <img
                src="/img/tsebo-rapid.png"
                :style="{
                  display: 'flex',
                  width: '200px',
                }"
                :alt="`${authUser} Logo`"
              />
            </nuxt-link>
          </h2>

          <div class="search-box hide"></div>
        </div>
        <div class="d-flex justify-content-center align-items-center my-5">
          <div id="generated" class="mg-b-20">
            <div class="d-none">
              <input type="text" v-model="closeUrl" />
            </div>
            <VueQRCodeComponent :text="closeUrl" size="700" id="qrcode">
            </VueQRCodeComponent>

            <div class="mg-t-20">
              <div
                class="text-dark mg-b-5 font-weight-bold"
                :style="{ fontSize: '1.7rem' }"
              >
                Asset Name: {{ equipment.name }}
              </div>
              <div
                class="text-dark mg-b-5 font-weight-bold fs-4"
                :style="{ fontSize: '1.7rem' }"
              >
                Location: {{ equipment.unit.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <button
            id="download"
            @click="download()"
            class="btn btn-primary mg-t-10"
          >
            Print QrCode
          </button>
        </div>
      </div>
      <!-- media-body -->
    </div>
    <!-- slim-footer -->
  </body>
</template>

<script>
import authMixin from "@/mixins/hagul/auth";
import loading from "@/components/ui/loading";
import layoutMixin from "@/mixins/layout";
import VueQRCodeComponent from "vue-qrcode-component";

export default {
  components: { loading, VueQRCodeComponent },
  created() {
    this.setEquipment(this.$route.query.id);
  },
  data: () => ({
    equipment: null,
    apiPagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    unit: null,
    shouldRefresh: false,
    loading: true,
    isUrl: "",
    openUrl: 34,
    closeUrl: ""
  }),
  head: () => ({
    title: "Purchase Order · Hagul"
  }),
  meta: {
    pageName: "purchase-orders.show"
  },
  methods: {
    download() {
      if (this.loading == false) {
        let downloadbtn = document.getElementById("download");
        downloadbtn.style.display = "none";
        window.print();
        downloadbtn.style.display = "flex";
      }
    },
    imageLoaded() {
      this.logoLoading = false;
    },
    async setEquipment(id) {
      const { detailedAssociations } = this.$store.state.assets.equipment;
      this.loading = true;
      try {
        const response = await this.$axios.get("equipment/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "assets/equipment/setEquipment",
          response.data.equipment
        );
        this.equipment = response.data.equipment;
        this.isUrl = response.data.equipment.id;

        this.closeUrl =
          "https://app.vampfi.com/assets/equipment/details?id=" + this.isUrl;

        this.loading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    setApiPagination({ total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      this.apiPagination = { total, perPage, page, lastPage };
    },
    updateEquipment() {
      this.shouldRefresh = true;
      this.setEquipment(this.$route.query.id);
    }
  },
  mounted() {
    this.setEquipment(this.$route.query.id);
  },
  middleware: ["auth", "roleGuard"]
};
</script>
