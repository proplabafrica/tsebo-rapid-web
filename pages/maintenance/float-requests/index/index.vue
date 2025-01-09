<template>
  <div>
    <div class="container-lg">
      <div class="row d-flex justify-content-between">
        <input type="text" placeholder="Start typing here to search"
          class="col-5 col-md-3 form-control search mg-y-10 mg-x-30 h-25" v-model="floatRequestSearch" />

        <div class="col-12 col-md-6 mg-b-20 mg-10">
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-list-outline tx-danger"></i>
              <div class="media-body">
                <div class="d-flex justify-content-between col-md-10">
                  <h1 class="pos-relative t-10">{{ { value: monthlyCost } | toMoney }}</h1>
                  <select class="form-control col-md-7 tx-capitalize" name="sla_id" v-model="statusUnitName"
                    @change="setStatusFilter()" required>
                    <!-- <option :value="options.value" v-text="options.text">{{options.text}}</option> -->
                    <option v-for="status in statusNames" :key="status.id" :value="status" v-text="status"></option>
                  </select>
                </div>
                <div class="formal-button px-2 p-t-2 p-b-2 pos-relative r-30 b-10" style="float: right"
                  @click="showCalender = !showCalender">
                  <i class="ionicons ion-android-menu tx-teal"></i>
                </div>
                <div class="formal-button px-2 p-t-2 p-b-2 pos-relative b-10 r-30" style="float: right"
                  @click="clearRange">
                  <i class="ionicons ion-refresh tx-teal"></i>
                </div>
                <p class="pos-relative l-10" style="width: 12rem">Float Disbursement</p>
                <p class="pos-relative l-5 t-5" style="width: 18.23rem">{{`(` + monthRange + `)`}}</p>
                <date-picker @update="$emit('update')" class="calender" :class="{ show: showCalender }" v-model="range"
                  is-range @input="getMonthlyCost" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- :list="filteredList" -->
    <v-paginate class="bg-white" :list="floatRequests" v-if="!floatRequestsLoading" perPage="50">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Request</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="floatSetting in paginate.list" :key="floatSetting.id">
                <td>
                  <nuxt-link :to="
                    `/maintenance/float-requests/details?id=${floatSetting.id}`
                  " class="tx-inverse tx-14 tx-medium d-block" v-text="floatSetting.name"></nuxt-link>
                  <span class="tx-11 d-block" v-text="`Code: ${floatSetting.code}`"></span>
                </td>
                <td>
                  <nuxt-link v-if="floatSetting.unit" :to="`/location/units/details?id=${floatSetting.unit.id}`"
                    class="tx-inverse d-block">
                    {{ floatSetting.unit.name }}
                    <span class="d-block" v-if="floatSetting.unit.parent">({{ floatSetting.unit.parent.name }})</span>
                  </nuxt-link>
                </td>
                <td>
                  <span>{{ floatSetting.created_at | dateFormat }}</span>
                </td>
                <td>
                  <span v-text="floatSetting.status.name"></span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <th colspan="4">
                  <h5>No data to display</h5>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import { mapActions } from "vuex";
import moment from "moment";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  components: { loading, vPaginate, DatePicker },
  created() {
    this.setScope(this.$route.query.scope);
    this.getMonthlyCost();
    this.statusFilter();
  },
  // mounted(){
  // this.statusFilter();
  // },
  computed: {
    filteredList() {
      return this.floatSetting.filter(
        (floatRequest) =>
          (floatRequest.unit.name === this.statusUnitName) &&
          floatRequest.status.code === "approved"
      )
    }
  },
  data: () => ({
    floatRequests: [],
    floatRequestsLoading: true,
    floatRequestStatusCodes: [],
    floatRequestSearch: null,
    range: {
      start: new Date(),
      end: new Date(),
    },
    dateTime: new Date().toString().substring(4, 15),
    monthRange: "",
    showCalender: false,
    monthlyCost: 0,
    floatItems: [],
    floatItemsLoading: true,
    floatOutputs: [],
    floatOutputsRangeBy: "updated_at",
    floatOutputsRangeFrom: null,
    floatOutputsRangeTo: null,
    statusNames: [],
    statusUnitName: "",
    locationUnits: [],
    options: { text: 'All', value: 'All' },
    floatSetting: [],
  }),
  head: () => ({
    title: "Float Requests · Tsebo-Rapid"
  }),
  meta: {
    pageName: "float-requests.index"
  },
  methods: {
    ...mapActions({
      getFloatRequests: "maintenance/floatRequests/getFloatRequests",

    }),
    setScope(scope) {
      this.floatRequestStatusCodes = this.floatRequestScopeStatuses[scope];
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getFloatRequests(this);
      // this.statusFilter();
    },
    async statusFilter() {
      this.floatItemsLoading = true;

      let statusResponse = []
      try {
        const response = await this.$axios("float-requests", {
          params: {
            associations: ["unit", "status"]
          },
        });

        statusResponse = response.data.data;
        this.floatItemsLoading = false;

        // "SPINALL TWENTY Girls ", statusResponse)
      } catch (error) {
        console.log(error);
      }

      let names = []
      for (const i in statusResponse) {
        if (names.includes(statusResponse[i].unit.name)) {
          continue
        } else {
          names.push(statusResponse[i].unit.name)
        }
      }
      this.statusNames = names.sort()
      // this.floatItemsLoading = false;
      // this.statusNames, "first...")
    },
    setStatusFilter() {

      // "Eating Beans>>>", this.statusUnitName)
      // "Filmo=============", this.locationUnit)
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss"),
      };
    },
    clearRange() {
      this.range = null;
    },
    async getMonthlyCost() {
      this.showCalender = false;
      this.floatItemsLoading = true;

      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );
      this.dateTime = name;
      // "This is my name++++", name);

      this.floatOutputsRangeFrom = this.range ? this.range.start : rangeFrom;
      this.floatOutputsRangeTo = this.range ? this.range.end : rangeTo;
      try {
        const response = await this.$axios("float-requests", {
          params: {
            associations: ["items", "unit", "status"],
            rangeBy: "created_at",
            rangeFrom: this.floatOutputsRangeFrom,
            rangeTo: this.floatOutputsRangeTo,
          },
        });

        this.floatItems = response.data.data;
        this.floatItemsLoading = false;

        const filteredStatus = this.floatItems.filter(
          (floats) => floats.status.code === "approved" && floats.unit.name.includes(this.statusUnitName)
        )

        // const filteredRange = filteredStatus.filter(
        //   (floats) => floats.unit.name.includes(this.statusUnitName)
        // )

        this.floatSetting = filteredStatus;
        // "education is the key>>>>>", this.floatSetting)


        let floatCost = [];
        let superFloat = [];
        for (let i = 0; i < filteredStatus.length; i++) {
          for (let floatList of filteredStatus[i].items) {
            if (floatList.cost != null) {
              floatCost.push(floatList);
              superFloat.push(floatList.created_at);
            }
          }
        }
        // "what is going on", floatCost)
        // "this is the float items ++++ ", this.floatItems);
        // "this is the logic of the tower >>>>>>", superFloat);


        var floatCostObject = floatCost.map((float) => {
          var floatTotalCost =
            float.cost != null ? float.cost : 0

          return {
            quantity: float.quantity,
            cost: floatTotalCost,
          };
        });

        // "floating is this ++++",floatCostObject)

        this.monthRange = this.range
          ? `${this.range.start.toString().substring(4, 15)} - ${this.range.end
            .toString()
            .substring(4, 15)}`
          : name;

        this.monthlyCost = floatCostObject.reduce(
          (sum, float) => (sum += float.cost * float.quantity),
          0
        );
        // "This is the range+++", this.monthRange);
        this.floatItemsLoading = false;

      } catch (error) {
        console.log(error);
      }
    },


  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  props: ["floatRequestScopeStatuses"],
  watch: {
    $route(to) {
      this.$store.commit("maintenance/floatRequests/toggleRefresh");
      this.setScope(to.query.scope);
    },
    check(floatRequests) {
      this.statusFilter()
    },
    floatRequestSearch(search) {
      this.debounce(() => {
        this.getFloatRequests(this);
      }, 300);
    }
  }
};
</script>


<style scoped>
.calender {
  transition-property: display;
  transition-duration: 1000ms;
  transition-delay: 500ms;
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: absolute;
  left: 25px;
  top: 70px;
  z-index: 9900;
  display: none;
}

.show {
  transition-property: display;
  transition-duration: 1s;
  transition-delay: 1s;
  display: block;
}

.wrapper {
  position: fixed;
  background-color: rgba(29, 28, 28, 0.438);
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
}

.container {
  overflow-y: scroll;
  margin-top: 20px;
  min-height: 30%;
  width: 95%;
  margin-bottom: 20px;
  background-color: white;
}

.select-month {
  width: 300px;
  margin: 20px 5px;
}

.no-data {
  font-size: 20px;
}
</style>
