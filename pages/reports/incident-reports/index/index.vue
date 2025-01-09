<template>
  <incident-report-by-scope ref="table" :scopeStatuses="scopeStatuses" />
</template>

<script>
import incidentReportByScope from "@/components/reports/incident-reports/by-scope";

export default {
  components: { incidentReportByScope },
  props: ["scopeStatuses"],
  meta: {
    pageName: "incident-reports.index"
  },
  methods: {
    updateIncidentReports() {
      var child = this.$refs.table;
      child.updateIncidentReports();
    }
  },
  middleware: ["auth", "roleGuard"]
};
</script>
