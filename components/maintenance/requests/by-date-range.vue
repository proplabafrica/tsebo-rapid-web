<template>
  <div>
    <slot :workRequests="workRequests"></slot>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  created() {
    this.getWorkRequests(this);
  },
  data: () => ({
    workRequests: [],
    workRequestsLoading: true
  }),
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequestss/getWorkRequests"
    })
  },
  props: ["workRequestsRangeBy", "workRequestsRangeFrom", "workRequestsRangeTo"]
};
</script>
