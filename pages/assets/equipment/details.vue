<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb" v-if="equipment">
        <li class="breadcrumb-item">
          <nuxt-link to="/assets">Assets</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-if="equipment.unit">
          <nuxt-link :to="`/location/units/details?id=${equipment.unit.id}`">{{
            equipment.unit.name
          }}</nuxt-link>
        </li>
        <li class="breadcrumb-item">{{ equipment.name }}</li>
      </ol>
      <ol class="breadcrumb slim-breadcrumb" v-else></ol>
      <h6 class="slim-pagetitle">
        {{
          equipment
            ? equipment.name + " (" + equipment.code + ")"
            : "Equipment Details"
        }}
      </h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col-lg-3 order-lg-2">
        <div class="card">
          <div class="media-list">
            <div class="media mg-t-25">
              <div class="media-body mg-x-25 mg-t-4">
                <span class="card-profile-position d-flex justify-content-center align-items-center" v-if="equipment">
                  <b>{{ equipment.name }}</b>
                </span>

                <span
                  class="d-flex justify-content-center align-items-center tx-inverse"
                  :class="equipmentClasses(equipment, 'capacities')"
                  v-for="(capacity, index) in equipment.specification
                    .capacities"
                  :key="`capacity-${capacity.id}`"
                  >{{ capacity.name
                  }}{{
                    index + 1 >= equipment.specification.capacities.length
                      ? ""
                      : ", "
                  }}</span
                >
                <span
                  class="d-flex justify-content-center align-items-center tx-inverse"
                  :class="equipmentClasses(equipment, 'brands')"
                  v-for="(brand, index) in equipment.specification.brands"
                  :key="`brand-${brand.id}`"
                  >{{ brand.name
                  }}{{
                    index + 1 >= equipment.specification.brands.length
                      ? ""
                      : ", "
                  }}</span
                >
                <span
                  class="d-flex justify-content-center align-items-center tx-inverse"
                  :class="equipmentClasses(equipment, 'categories')"
                  v-for="(category, index) in equipment.categories"
                  :key="`category-2-${category.id}`"
                  >{{ category.name
                  }}{{
                    index + 1 >= equipment.categories.length ? "" : ", "
                  }}</span
                >
                <div
                  class="d-flex justify-content-center align-items-center my-2"
                  :style="{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }"
                >
                  <div id="generated" class="mg-b-10"
                    :style="{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }"
                  >
                    <div class="d-none">
                      <input type="text" v-model="closeUrl" />
                    </div>
                    <VueQRCodeComponent :text="closeUrl" size="150" id="qrcode">
                    </VueQRCodeComponent>

                    <div
                      class="mg-t-10"
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }"

                    >
                      <div class="mg-b-5">Asset Name: {{ equipment.name }}</div>
                      <div class="mg-b-5">
                        Location: {{ equipment.unit.name }}
                      </div>
                    </div>
                    <span class="d-block">
                      <nuxt-link
                        class="btn btn-primary btn-sm bd-0 pd-x-25 mg-x-5"
                        :to="`/assets/equipment/print-slip?id=${equipment.id}`"
                      >
                        <i class="icon ion-ios-printer-outline"></i> Download
                        QrCode
                      </nuxt-link>
                    </span>
                  </div>
                </div>


              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
            <div class="media pd-10">
              <!-- <div>
                <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                  <b v-if="equipment" v-text="`${equipment.name}:`"></b>
              </div> -->
              <!-- media-body -->
              <v-button
                :disabled="disabled"
                @click="switchStatus()"
                class="d-block wd-100p btn"
                :class="[`btn-${statusDisplay.class}`]"
              >
                <i class="icon ion-power mg-r-5"></i>
                {{ statusDisplay.text }}
              </v-button>
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->

      <div class="col order-lg-1 mg-t-10 mg-lg-t-0">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/assets/equipment/details?id=${equipment.id}`"
              class="nav-link"
              exact-active-class="active"
              :class="{
                active: currentActiveRoutes.includes(
                  'assets-equipment-details-index'
                )
              }"
            >
              <i class="icon ion-settings tx-gray-600"></i> Maintenance
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :to="`/assets/equipment/details/settings?id=${equipment.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-ios-gear tx-primary"></i> Settings
            </nuxt-link>
          </li>
        </ul>
        <!-- <nuxt-child/> -->
        <!-- nav -->
        <nuxt-child @update="updateEquipment()" :equipment="equipment" />
      </div>
      <!-- col -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import layoutMixin from "@/mixins/layout";
import vButton from "@/components/ui/v-button";
import VueQRCodeComponent from "vue-qrcode-component";

export default {
  components: { loading, vButton, VueQRCodeComponent },
  created() {
    this.setEquipment(this.$route.query.id);
  },
  computed: {
    statusDisplay() {
      if (this.loading || !this.equipment) return {};
      if (this.equipment.active == 0)
        return { class: "success", text: "ACTIVATE" };

      return { class: "warning", text: "DEACTIVATE" };
    }
  },
  meta: {
    pageName: "assets.index"
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
    disabled: false,
    isUrl: "",
    openUrl: 34,
    closeUrl: ""
  }),
  methods: {
    download() {
      if (this.loading == false) {
        let downloadbtn = document.getElementById("download");
        downloadbtn.style.display = "none";
        window.print();
        downloadbtn.style.display = "flex";
      }
    },
    createSaveBtn(saveUrl) {
      const link = document.createElement("a");
      link.id = "save-link";
      link.classList =
        "bg-danger hover:bg-warning text-white font-weight-bold  px-2 pt-2 pb-2 pos-relative t-20 l-50 rounded w-50 m-t-2 m-b-2";
      link.href = saveUrl;
      link.download = "qrcode";
      link.innerHTML = "Save Image";
      const generated = document.getElementById("generated").appendChild(link);
    },
    loadImage() {
      const qr = document.getElementById("qrcode");
      const saveUrl = qr.querySelector("img").src;

      setTimeout(() => {
        // Get save url
        // const saveUrl = qr.querySelector('img').src;
        // Create save button
        this.createSaveBtn(saveUrl);
      }, 1000);

      // this.createSaveBtn(saveUrl);

    },
    equipmentClasses(equipment, field) {
      if (field == "capacities" && !equipment.specification.name)
        return ["tx-medium"];
      if (
        field == "brands" &&
        !equipment.specification.name &&
        equipment.specification.capacities.length < 1
      )
        return ["tx-medium"];
      if (
        field == "categories" &&
        !equipment.specification.name &&
        equipment.specification.capacities.length < 1 &&
        equipment.specification.brands.length < 1
      )
        return ["tx-medium"];
      return ["tx-11"];
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
    async switchStatus() {
      var active = 0,
        equipment_id = this.equipment.id;
      if (this.equipment.active == 0) active = 1;
      this.disabled = true;

      try {
        await this.$axios.post("equipment/switch", {
          active,
          equipment_id
        });
        this.disabled = false;
        this.updateEquipment();
      } catch (error) {
        console.log(error);
        this.disabled = false;
      }
    },
    setApiPagination({ total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      this.apiPagination = { total, perPage, page, lastPage };
    },
    updateEquipment() {
      this.shouldRefresh = true;
      this.loading = true;
      this.setEquipment(this.$route.query.id);
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, layoutMixin]
};
</script>
