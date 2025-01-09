export default {
  beforeDestroy() {
    // for (const modal of this.openModals) {
    //   this.closeModal(modal)
    // }
  },
  data: () => ({
    openModals: []
  }),
  directives: {
    "modal-open": {
      bind(el, binding, vnode) {
        el.addEventListener("click", () => {
          vnode.context.$refs[binding.value].show = true;
          // document.body.style.overflowY = "hidden";
        });
        // vnode.context.openModals.push(binding.value)
      }
    },
    "modal-close": {
      bind(el, binding, vnode) {
        el.addEventListener("click", () => {
          vnode.context.$refs[binding.value].show = false;
          document.body.style.overflowY = "auto";
        });
        // const index = vnode.context.openModals.indexOf(binding.value)
        // if (index > -1) vnode.context.openModals.splice(index, 1)
      }
    }
  },
  methods: {
    closeModal(ref) {
      this.$refs[ref].show = false;
      document.body.style.overflowY = "auto";
      const index = this.openModals.indexOf(ref);
      if (index > -1) this.openModals.splice(index, 1);
    },
    openModal(ref) {
      this.$refs[ref].show = true;
      document.body.style.overflowY = "hidden";
      // vnode.context.openModals.push(binding.value)
    }
  }
};
