import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "cycles",
      "equipmentList.unit",
      "plan",
      "plan.frequencyMeasurement",
      "logs.comment",
      "logs.createdBy.roles"
    ],
    detailedAssociations: [
      "plan",
      "cycles",
      "equipmentList.unit",
      "plan",
      "plan.frequencyMeasurement",
      "plan.reminderMeasurement",
      "plan.equipmentSpecs",
      "plan.trades",
      "unit",
      "unit.hierarchy",
      "unit.parent",
      "status",
      "workRequests",
      "createdBy",
      "logs.comment",
      "logs.createdBy.roles"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    jobSchedules: [],
    refresh: true
  }),
  mutations: {
    setJobSchedule(state, jobSchedule) {
      state.jobSchedules = dataSort.addOjectToList({
        targetArray: state.jobSchedules,
        newObject: jobSchedule,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setJobSchedules(state, jobSchedules) {
      state.jobSchedules = dataSort.populateList({
        targetArray: state.jobSchedules,
        newArray: jobSchedules,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    setPagination(state, { total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      state.pagination = { total, perPage, page, lastPage };
    },
    toggleRefresh(state, refresh = true) {
      state.refresh = refresh;
    }
  },
  actions: {
    async getJobSchedules({ commit, state }, $this) {
      $this.jobSchedulesLoading = true;
      var { associations, jobSchedules, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        jobScheduleAssociations = associations,
        jobSchedulesEquipmentIds = [],
        jobSchedulesMaintenancePlanId = null,
        jobSchedulesPerPage = perPage,
        jobSchedulesRangeBy = null,
        jobSchedulesRangeFrom = null,
        jobSchedulesRangeTo = null,
        jobScheduleSearch = null,
        jobScheduleStatusCodes = [],
        jobSchedulesSortBy = "created_at",
        jobSchedulesSortOrder = "desc",
        jobSchedulesUnitIds = []
      } = $this;

      if (refresh == false && !jobScheduleSearch) {
        $this.jobSchedulesLoading = false;
        return ($this.jobSchedules = jobSchedules);
      }

      try {
        const response = await $axios.get("job-schedules", {
          params: {
            associations: jobScheduleAssociations,
            byStatusCodes: jobScheduleStatusCodes,
            byUnitIds: jobSchedulesUnitIds,
            byEquipmentIds: jobSchedulesEquipmentIds,
            byMaintenancePlanId: jobSchedulesMaintenancePlanId,
            page,
            perPage: jobSchedulesPerPage,
            rangeBy: jobSchedulesRangeBy,
            rangeFrom: jobSchedulesRangeFrom,
            rangeTo: jobSchedulesRangeTo,
            search: jobScheduleSearch,
            sortBy: jobSchedulesSortBy,
            sortOrder: jobSchedulesSortOrder
          }
        });
        $this.jobSchedules = response.data.data;
        $this.jobSchedulesLoading = false;
        commit("setJobSchedules", response.data.data);
        if (jobScheduleSearch) commit("toggleRefresh");
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
