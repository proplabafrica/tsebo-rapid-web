<template>
  <work-request-by-scope :scopeStatuses="scopeStatuses" />
</template>

<script>
import workRequestByScope from "@/components/maintenance/requests/reports/by-scope";

export default {
  components: { workRequestByScope },
  props: ["scopeStatuses"],
  meta: {
    pageName: "work-requests.index"
  },
  middleware: ["auth", "roleGuard"]
};
</script>
