<template>
  <div>
    <div>
      <span class="d-flex flex-column float-left">
        <input type="text" placeholder="Start typing here to search" class="form-control search mg-y-10"
          v-model="workRequestSearch" />
      </span>

      <!-- Filter bar -->
      <span class="d-flex flex-column float-right">
        <select class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize" name="`hierarchy-`"
          v-model="workRequestItem.value">
          <option :value="null">
            {{ workArrayItems ? "Show All Value" : "Sort Value" }}
          </option>
          <option v-for="(workArrayItem, index) in workArrayItems" :key="`facility-${index}`"
            :value="workArrayItem.value">
            {{ workArrayItem.label }}
          </option>
        </select>
      </span>
    </div>

    <status-tracker v-if="!workRequestsLoading" :workRequests="filteredWorkRequest" />
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import statusTracker from "@/components/maintenance/requests/status-tracker";

export default {
  components: { loading, statusTracker },
  created() {
    this.getWorkRequests(this);
  },
  data: () => ({
    workRequests: [],
    workRequestAssociations: [
      "clientRequest",
      "createdBy",
      "logs.status",
      "unit.parent",
      "priority",
      "sla.measurement",
      "sla.priority",
      "status",
      "ratings",
      "invoices.status",
      "invoices.currency"
    ],
    workRequestsLoading: true,
    workRequestSearch: null,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc",
    workRequestStatusCodes: [],
    workArrayItems: [
      // {value: 'value', label: 'Show All Value'},
      // {value: 'alphabet', label: 'A-Z'},
      // {value: 'date', label: 'Recent Date'},

      { value: "completed", label: "Completed Jobs" }
    ],
    workRequestItem: {
      value: null
    },
    facility: null,
    recentDate: null
  }),
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests"
    }),
    reloadWorkRequests() {
      this.workRequestsLoading = true;
      this.getWorkRequest();
    }
  },
  computed: {
    filteredWorkRequestItem: {
      get() {
        if (this.workRequestItem.value === "value") {
          // "all the work request...", this.workRequests, this.workRequestItem)
          this.facility = this.workRequests;
          return this.workRequests;
        } else if (this.workRequestItem.value === "alphabet") {
          this.workRequestsLoading = true;
          this.facility = this.workRequests.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          this.workRequests = this.facility;
          // "all the value..", this.facility, "request made..", this.workRequests);
          this.workRequestsLoading = false;
          return this.facility;
        } else if (this.workRequestItem.value === "date") {
          this.workRequestsLoading = true;
          this.facility = this.workRequests.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          this.workRequests = this.facility;
          // "inter state..", this.facility, "request country..", this.workRequests);
          this.workRequestsLoading = false;
          return this.facility;
        } else if (this.workRequestItem.value === "completed") {
          this.workRequestsLoading = true;
          this.facility = this.workRequests.sort((a, b) => {
            if (a.status.code === "65" && b.status.code !== "65") {
              return -1;
            } else if (a.status.code !== "65" && b.status.code === "65") {
              return 1;
            } else {
              return 0;
            }
          });
          this.workRequests = this.facility;
          // "inter..", this.facility, "request country..", this.workRequests);
          this.workRequestsLoading = false;
          return this.facility;
        } else {
          return this.workRequests;
        }
      }
      // set(newValue) {
      //   this.cycles = newValue;
      // }
    },

    filteredWorkRequest: {
      get() {
        if (this.workRequestItem.value === "completed") {
          this.workRequestsLoading = true;

          let facilityItem = null;

          this.facility = this.workRequests.filter((item) => {
            return (item.status.code === "65");
          });

          // "factility..", this.facility);

          facilityItem = this.facility.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // "transform..", facilityItem);

          this.recentDate = facilityItem

          // "object...", this.recentDate);

          // this.workRequests = this.recentDate;
          // "inter..", this.recentDate, "request country..", this.workRequests);
          this.workRequestsLoading = false;
          return this.recentDate;
        } else if (this.workRequestItem.value === "Show All value ") {

          // "ALL THE VALUE IS THIS LIFE..", this.workRequests)
          
          
          this.workRequestsLoading = false;
          return this.workRequests;
        }  else {
          return this.workRequests;
        }
      }
      // set(newValue) {
      //   this.cycles = newValue;
      // }
    }
  },
  watch: {
    workRequestSearch(search) {
      this.debounce(() => {
        this.getWorkRequests(this);
      }, 300);
    }
  }
};
</script>
