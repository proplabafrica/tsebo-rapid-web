export default {
  state: () => ({
    toasts: []
  }),
  mutations: {
    addToast: (state, toast) => state.toasts.push(toast),
    removeToast: (state, id) =>
      (state.toasts = state.toasts.filter(toast => toast.id != id))
  },
  actions: {
    addToast(
      { commit, state },
      { at = null, body = null, title = null, type = "info" }
    ) {
      var id = null;
      do {
        id = Math.random();
      } while (state.toasts.find(toast => toast.id == id));
      commit("addToast", Object.assign({ id }, { at, body, title, type }));
      setTimeout(() => commit("removeToast", id), 10000);
    }
  }
};
