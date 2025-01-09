<template>
  <work-request-by-scope :scopeStatuses="scopeStatuses" />
</template>

<script>
import workRequestByScope from "@/components/maintenance/requests/reports/by-scope";

export default {
  components: { workRequestByScope },
  meta: {
    pageName: "work-requests.index"
  },
  mixins: ["auth", "roleGuard"],
  props: ["scopeStatuses"]
};
</script>
