<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/assets/maintenance/hospital-list"
            >Facilities</nuxt-link
          >
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ currentList == "listOfHospitals" ? "Facilities" : "Rooms" }}
        </li>
      </ol>
      <h6 class="slim-pagetitle">
        {{ currentList == "listOfHospitals" ? "Facilities" : "Rooms" }}
      </h6>
    </div>
    <!-- slim-pageheader -->
    <v-paginate class="col mg-t-10 mg-md-0 pd-0" :list="demoList" perPage="60">
      <template v-slot="paginate">
        <div class="row mg-0">
          <div
            class="col-md-4 col-lg-3 pd-md-0"
            v-for="demo in paginate.list"
            :key="demo.id"
          >
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <p class="mg-b-0">
                  <nuxt-link
                    class="d-block tx-inverse"
                    :to="`#`"
                    @click.native="toggleDemoList()"
                  >
                    <strong class="tx-medium" v-text="demo.name"></strong>
                  </nuxt-link>
                </p>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
      </template>
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
  </div>
</template>

<script>
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { vPaginate },
  computed: {
    demoList() {
      return this[this.currentList];
    }
  },
  data: () => ({
    currentList: "listOfHospitals",
    listOfHospitals: [
      { name: "Lagos General Hospital" },
      { name: "Orile Agege General Hospital" },
      { name: "Epe General Hospital" },
      { name: "Gbagada General Hospital" },
      { name: "Ifako General Hospital" }
    ],
    listOfOffices: [
      { name: "Doctor's office" },
      { name: "Maternity room" },
      { name: "Operating Theatre" },
      { name: "X-ray room" },
      { name: "Emergency room" },
      { name: "Laboratory" }
    ]
  }),
  methods: {
    toggleDemoList() {
      if (this.currentList == "listOfHospitals")
        return (this.currentList = "listOfOffices");
      if (this.currentList == "listOfOffices")
        return this.$router.push("/assets/maintenance/details");
    }
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
