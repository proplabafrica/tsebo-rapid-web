<template>
  <v-paginate :list="filteredManagers" :perPage="30">
    <template v-slot="paginate">
      <div class="row">
        <input
          type="text"
          v-model="search"
          v-if="units.length > 5"
          class="form-control wd-200 mg-b-5 col-lg-7 col-md-7 ml-3"
          placeholder="Type here to search"
        />
        <div class="col-md-12 col-lg-12" v-if="paginate.list.length > 0">
          <ul
            v-if="paginate.list.length"
            class="list-group col-md-12 col-lg-12"
            style="width: 230px"
          >
            <li
              class="list-group-item"
              v-for="unit in paginate.list"
              :key="unit.id"
            >
              <!-- {{hierarchy}} -->
              <p class="mg-b-0">
                <nuxt-link
                  class="tx-inverse"
                  :to="`/location/units/details?id=${unit.id}`"
                >
                  <strong class="tx-medium" v-text="unit.name"></strong>
                </nuxt-link>
              </p>
              <!-- <div>{{unit}}</div> -->
            </li>
            <!-- {{parentUnit}} -->
          </ul>
          <h6 v-else>No Units found</h6>
          <!-- <div
            class="mg-b-2 d-flex justify-content-between"

          >
            <nuxt-link
              class="tx-inverse"
              :to="`/location/units/details?id=${unit.id}`"
            >
              <strong class="tx-medium" v-text="unit.name"></strong>
            </nuxt-link>
          </div> -->
        </div>
        <div class="col-lg-12 col-md-12" v-else>No Units to display</div>
        <!-- col-6 -->
      </div>
      <!-- row -->
      <!-- <h6 v-else>No Units to display</h6> -->
    </template>
    <!-- table-responsive -->
    <template
      v-slot:linksWrapper
      class="tx-13 pd-y-15 bg-transparent"
    ></template>
    <!-- card-footer -->
  </v-paginate>
</template>

<script>
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/auth";
import vPaginate from "@/components/ui/paginate";
import loading from "@/components/ui/loading";

export default {
  components: { vPaginate, loading },
  created() {},
  async mounted() {
    await this.setUser(this.authUser.id);
    await this.facilityManagerUnits();
    this.getUnits();
  },
  computed: {
    filteredManagers() {
      if (this.search)
        return this.units.filter(
          (unit) =>
            unit.name.toLowerCase().includes(this.search.toLowerCase()) ||
            unit.code.toLowerCase().includes(this.search.toLowerCase())
        );




      return this.units;
    }
  },
  methods: {
    getUnits() {
      for (const i in this.hierarchy.units) {
        if (this.hierarchy.units[i].parent_unit_id == null) {
          for (const j in this.facilityManagers) {
            if (
              this.hierarchy.units[i].id == this.facilityManagers[j].id &&
              this.hierarchy.units[i].name == this.facilityManagers[j].name
            ) {
              this.units.push(this.facilityManagers[j]);
            }
          }
        } else if (this.hierarchy.parent_unit_id !== null) {
          this.units.push(this.hierarchy.units[i]);
        }
      }
    },
    async setUser(id) {
      const { detailedAssociations } = this.$store.state.people.users;
      try {
        const response = await this.$axios.get("users/" + id, {
          params: { associations: detailedAssociations }
        });

        this.userManagers = response.data.user;
        this.userManagersId = this.userManagers.facilityManagers[0].id;
      } catch (error) {
        console.log(error);
      }
    },
    async facilityManagerUnits() {
      this.facilityManagersLoading = true;
      const byFactilityManagerId = this.userManagersId;
      try {
        const facilityManager = (
          await this.$axios.get("facility-managers/" + byFactilityManagerId, {
            params: { associations: ["units", "user"] }
          })
        ).data.facilityManager.units;
        this.facilityManagers = facilityManager;
        this.facilityManagersLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  data: () => ({
    facilityManagers: [],
    facilityManagersLoading: true,
    userLoading: true,
    shouldRefresh: true,
    facilityUnit: true,
    user: null,
    userManagers: [],
    userManagersId: null,
    search: null,
    units: []
  }),
  props: ["hierarchy", "parentUnit"],
  mixins: [modalMixin, authMixin]
};
</script>
