<template>
  <div class="table-responsive">
    <quotations-list :quotations="tenderProcess.quotations" />
  </div>
</template>

<script>
import quotationsList from "@/components/hagul/purchase/quotations/list";

export default {
  components: { quotationsList },
  props: ["tenderProcess"]
};
</script>
