<template>
  <div>
    <v-paginate class="bg-white" :list="assets" perPage="30" v-if="!assetsLoading">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5">Item #</th>
                <th class="pd-y-5">Asset Type</th>
                <th class="pd-y-5">Dimension/Capacity</th>
                <th class="pd-y-5">Date Of Acquisition</th>
                <th class="pd-y-5">Status</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="asset in paginate.list" :key="asset.id">
                <td>
                  <span>{{ asset.item }}</span>
                </td>
                <td>
                  <span>{{ asset.type }}</span>
                </td>
                <td>
                  <span>{{ asset.divisionOrCapacity }}</span>
                </td>
                <td>
                  <span>{{ asset.acquisitionDate }}</span>
                </td>
                <td>
                  <span>{{ asset.status }}</span>
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
      </template>
      <!-- table-responsive -->
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      <!-- card-footer -->
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  data: () => ({
    assets: [
      {
        item: "CEILING",
        type: "CONCRETE",
        divisionOrCapacity: "4.2X2.7",
        acquisitionDate: "23-07-2005",
        status: "Faulty"
      },
      {
        item: "FLUORESCENT",
        type: "DOUBLE",
        divisionOrCapacity: "4FT",
        acquisitionDate: "24-04-2005",
        status: "Not Faulty"
      },
      {
        item: "FLUORESCENT FITTING",
        type: "TWIN FITTING",
        divisionOrCapacity: "4FT",
        acquisitionDate: "25-07-05",
        status: "Faulty"
      },
      {
        item: "WALL",
        type: "BLOCKWALL",
        divisionOrCapacity: "4.2X2.7",
        acquisitionDate: "26-02-05",
        status: "Not Faulty"
      },
      {
        item: "SOCKET",
        type: "TWIN",
        divisionOrCapacity: "13AMP",
        acquisitionDate: "27-02-05",
        status: "Faulty"
      },
      {
        item: "SWITCH",
        type: "1 GANG",
        divisionOrCapacity: "1 GANG",
        acquisitionDate: "28-04-05",
        status: "Not Faulty"
      },
      {
        item: "SWITCH",
        type: "DP SWITCH",
        divisionOrCapacity: "20AMP",
        acquisitionDate: "29-01-05",
        status: "Faulty"
      },
      {
        item: "SOCKET",
        type: "SINGLE",
        divisionOrCapacity: "13AMP",
        acquisitionDate: "30-04-05",
        status: "Not Faulty"
      },
      {
        item: "WASH HAND BASIN",
        type: "WALL FIXED",
        divisionOrCapacity: "MEDIUM",
        acquisitionDate: "01-05-05",
        status: "Faulty"
      },
      {
        item: "REFRIGERATOR",
        type: "LG",
        divisionOrCapacity: "1.5HP",
        acquisitionDate: "02-05-05",
        status: "Not Faulty"
      },
      {
        item: "FURNITURE",
        type: "TABLE AND CHAIR",
        divisionOrCapacity: "SET",
        acquisitionDate: "03-05-05",
        status: "Faulty"
      }
    ],
    assetsLoading: false
  }),
  head: () => ({
    title: "Assets · Tsebo-Rapid"
  }),
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
