<template>
  <client-requests />
</template>

<script>
import clientRequests from "@/components/maintenance/requests/reports/client-requests";

export default {
  components: { clientRequests },
  meta: {
    pageName: "client-requests.index"
  },
  middleware: ["auth", "roleGuard"]
};
</script>
