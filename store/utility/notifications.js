import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["comment", "entity"],
    detailedAssociations: [],
    fireBaseInitialized: false,
    notifications: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setNotification(state, notification) {
      state.notifications = dataSort.addOjectToList({
        targetArray: state.notifications,
        newObject: notification,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setNotifications(state, notifications) {
      state.notifications = dataSort.populateList({
        targetArray: state.notifications,
        newArray: notifications,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    setPagination(state, { total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      state.pagination = { total, perPage, page, lastPage };
    },
    toggleFireBaseInitialized(state, fireBaseInitialized = true) {
      state.fireBaseInitialized = fireBaseInitialized;
    },
    toggleRefresh(state, refresh = true) {
      state.refresh = refresh;
    }
  },
  actions: {
    async getNotifications({ commit, state }, $this) {
      $this.notificationsLoading = true;
      const { associations, pagination, notifications, refresh } = state;
      const { page, perPage } = pagination;
      const { $axios } = $this;

      if (refresh == false) {
        $this.notificationsLoading = false;
        return ($this.notifications = notifications);
      }

      try {
        const response = await $axios.get("notifications", {
          params: { associations, page, perPage }
        });
        commit("setNotifications", response.data.data);
        $this.notifications = response.data.data;
        $this.notificationsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
