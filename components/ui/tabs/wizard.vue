<template>
  <div class="row wizard">
    <div class="col-md-12 col-lg-3 steps">
      <ul class="nav nav-pills flex-column" role="tablist">
        <li
          class="nav-item"
          v-for="(tab, index) in tabs"
          :key="tab.name"
          :class="tabClasses(tab.name)"
        >
          <a
            class="nav-link"
            href="#"
            :class="tabClasses(tab.name)"
            @click="setTab(tab.name)"
          >
            <span class="number mg-r-5" v-text="index + 1"></span>
            <span v-text="tab.title"></span>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-lg-9 wizard-content">
      <slot :currentTab="currentTab"></slot>
    </div>
  </div>
  <!-- row -->
</template>

<script>
export default {
  created() {
    this.currentTab = this.parentCurrentTab;
    this.activeTabs.push(this.parentCurrentTab);
  },
  data: () => ({
    activeTabs: [],
    currentTab: null
  }),
  methods: {
    activateTab(tabName) {
      this.activeTabs.push(tabName);
      this.currentTab = tabName;
    },
    setTab(tabName) {
      if (!this.activeTabs.includes(tabName)) {
        return false;
      }
      this.currentTab = tabName;
      this.activeTabs = [];
      for (const tab of this.tabs) {
        if (!this.activeTabs.includes(tabName)) {
          this.activeTabs.push(tab.name);
        }
      }
    },
    tabClasses(tabName) {
      var classes = [];
      if (this.activeTabs.includes(tabName) && tabName != this.currentTab) {
        classes.push(["completed"]);
      }
      if (tabName == this.currentTab) {
        classes.push("current", "active");
      }
      return classes;
    }
  },
  props: ["tabs", "parentCurrentTab"],
  watch: {
    parentCurrentTab(val) {
      this.activateTab(val);
    }
  }
};
</script>
