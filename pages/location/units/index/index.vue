<template>
  <div class="manager-wrapper" v-if="!unitHierarchiesLoading">

    <div class="manager-right">
      <v-paginate :list="units" perPage="60" v-if="!unitsLoading">
        <template v-slot="paginate">
          <div class="row mg-0" v-if="paginate.list.length > 0">
            <div class="col-md-6 col-lg-4 pd-md-0" v-for="unit in paginate.list" :key="unit.id">
              <ul class="list-group">
                <li class="list-group-item ht-100">
                  <p class="mg-b-0">
                    <nuxt-link class="tx-inverse" :to="`/location/units/details?id=${unit.id}`">
                      <strong class="tx-medium" v-text="unit.name"></strong>
                    </nuxt-link>
                    <span class="d-block">
                      <i class="icon ion-ios-location-outline tx-20 mg-r-5"></i>
                      <span v-text="unit.address.address"></span>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
            <!-- col-4 -->
          </div>
          <!-- row -->
          <div v-else>
            <h4>No data to display</h4>
          </div>
        </template>
        <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      </v-paginate>
      <loading v-else />
    </div>
    <!-- manager-right -->
    <div class="manager-left">
      <input type="text" placeholder="Start typing here to search" class="form-control search mg-b-10"
        v-model="unitsSearch" />
      <nav class="nav">
        <nuxt-link v-for="hierarchy in unitHierarchies" :key="hierarchy.id"
          :to="`/location/units?hierarchy-id=${hierarchy.id}`" class="nav-link" exact-active-class="active">
          <span>{{ hierarchy.name }} List</span>
          <!-- <span v-text="role.__meta__.users_count"></span> -->
        </nuxt-link>
      </nav>
    </div>
    <!-- manager-left -->
  </div>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  computed: {
    unitsHierarchyIds() {
      return [this.$route.query["hierarchy-id"]];
    }
  },
  created() {
    this.getUnitHierarchies(this).then(() => {
      if (!this.$route.query["hierarchy-id"] && this.unitHierarchies.length > 0)
        this.$router.replace(`?hierarchy-id=${this.unitHierarchies[0].id}`);
      this.$store.commit("location/units/toggleRefresh");
      this.getUnits(this);
    });
  },
  data: () => ({
    baseUnitHierarchies: true,
    unitHierarchies: [],
    unitHierarchiesLoading: true,
    units: [],
    unitsAssociations: ["address"],
    unitsLoading: true,
    unitsSearch: null,
    addressId: null
  }),
  head: () => ({
    title: "Units · Tsebo-Rapid"
  }),
  methods: {
    ...mapActions({
      getUnits: "location/units/getUnits",
      getUnitHierarchies: "location/hierarchies/getUnitHierarchies"
    })
  },
  watch: {
    unitsHierarchyIds() {
      this.$store.commit("location/units/toggleRefresh");
      this.getUnits(this);
    },
    unitsSearch() {
      this.debounce(() => {
        this.getUnits(this);
      }, 300);
    }
  }
};
</script>
