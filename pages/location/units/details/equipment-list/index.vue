<template>
  <div>
    <input
      type="text"
      placeholder="Start typing here to search"
      class="form-control wd-200 mg-t-5 mg-b-10 mg-x-0 float-left"
      v-model="equipmentListSearch"
    />
    <select
      class="form-control wd-200 mg-t-5 mg-b-10 float-right tx-capitalize"
      v-model="unitId"
    >
      <option :value="null">
        {{ unitId ? "Show All" : "Filter By Unit" }}
      </option>
      <option v-for="unit in units" :key="`units-${unit.id}`" :value="unit.id">
        {{ unit.name }} <span v-if="unit.parent">({{ unit.parent.name }})</span>
      </option>
    </select>
    <b class="float-right pd-10" v-if="equipmentListSearch || unitId"
      >{{ equipmentList.length }} Matches</b
    >
    <v-paginate :list="equipmentList" perPage="30" v-if="!equipmentListLoading">
      <template v-slot="paginate">
        <div class="table-responsive bg-white">
          <table class="table table-striped mg-b-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specs</th>
                <th>Date Acquired</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="equipment in paginate.list" :key="equipment.id">
                <td>
                  <nuxt-link
                    :to="`/assets/equipment/details?id=${equipment.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="equipment.code"
                  ></nuxt-link>
                  <span class="tx-11 d-block" v-text="equipment.name"></span>
                </td>
                <td>
                  <span
                    v-for="(capacity, index) in equipment.specification
                      .capacities"
                    :key="`capacity-${capacity.id}`"
                    >{{ capacity.name
                    }}{{
                      index + 1 >= equipment?.specification?.capacities.length
                        ? ""
                        : ", "
                    }}</span
                  >
                  <span
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
                    v-for="(category, index) in equipment.specification
                      .categories"
                    :key="`category-${category.id}`"
                    >{{ category.name
                    }}{{
                      index + 1 >= equipment.specification.categories.length
                        ? ""
                        : ", "
                    }}</span
                  >
                </td>
                <td>
                  <span>{{ (equipment.acquired_at * 1000) | dateFormat }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="12">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- table-responsive -->
      </template>
      <!-- table-responsive -->
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

export default {
  components: { loading, vPaginate },
  computed: {
    equipmentListByUnitIds() {
      if (!this.unitId) return [];
      return [this.unitId];
    }
  },
  created() {
    this.equipmentListByUnitIds = [this.unit.id];
    this.getEquipmentList(this).then(() => {
      this.$store.commit("assets/equipment/toggleRefresh");
    });
    this.getUnits(this);
  },
  data: () => ({
    equipmentList: [],
    equipmentListByUnitIds: [],
    equipmentListLoading: true,
    equipmentListSearch: null,
    unitId: null,
    units: [],
    apiPagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    }
  }),
  methods: {
    ...mapActions({
      getEquipmentList: "assets/equipment/getEquipmentList",
      getUnits: "location/units/getUnits"
    }),
    setApiPagination({ total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      this.apiPagination = { total, perPage, page, lastPage };
    }
  },
  props: ["unit"],

  watch: {
    $route(to, from) {
      this.getEquipmentListByUnit(to.params.id);
    },
    refresh(val) {
      this.getEquipmentListByUnit(this.unit.id);
    },
    equipmentListSearch(search) {
      this.debounce(() => {
        this.equipmentListLoading = true;
        this.getEquipmentList(this);
      }, 300);
    },
    equipmentListByUnitIds() {
      this.$store.commit("assets/equipment/toggleRefresh");
      this.equipmentListLoading = true;
      this.getEquipmentList(this);
    }
  }
};
</script>
