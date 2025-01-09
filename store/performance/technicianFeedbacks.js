import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "remark",
      "task",
      "task.workRequests",
      "task.workRequests.status",
      "technicians",
      "technicians.user",
      "technicians.trades"
    ],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true,
    technicianFeedbacks: []
  }),
  mutations: {
    setTechnicianFeedback(state, technician) {
      state.technicianFeedbacks = dataSort.addOjectToList({
        targetArray: state.technicianFeedbacks,
        newObject: technician,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setTechnicianFeedbacks(state, technicianFeedbacks) {
      state.technicianFeedbacks = dataSort.populateList({
        targetArray: state.technicianFeedbacks,
        newArray: technicianFeedbacks,
        sortBy: "name"
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
    async getTechnicianFeedbacks({ commit, state }, $this) {
      var { associations, pagination, refresh, technicianFeedbacks } = state;
      const { page, perPage } = pagination;
      var {
        $axios,
        technicianFeedbacks,
        technicianFeedbacksRangeBy,
        technicianFeedbacksRangeFrom,
        technicianFeedbacksRangeTo
      } = $this;

      if (refresh == false) {
        $this.technicianFeedbacksLoading = false;
        return ($this.technicianFeedbacks = technicianFeedbacks);
      }

      try {
        const response = await $axios.get("technician-feedbacks", {
          params: {
            associations,
            page,
            perPage,
            rangeBy: technicianFeedbacksRangeBy,
            rangeFrom: technicianFeedbacksRangeFrom,
            rangeTo: technicianFeedbacksRangeTo
          }
        });
        commit("setTechnicianFeedbacks", response.data.data);
        $this.technicianFeedbacks = response.data.data;
        $this.technicianFeedbacksLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
