<template>
  <div class="timeline-group pd-10 bg-white">
    <div
      class="timeline-item"
      v-for="(log, index) in workRequest.logs"
      :key="log.id"
      :class="{ 'timeline-day': workRequest.logs.length == index + 1 }"
    >
      <div class="timeline-time">{{ log.created_at | dateFormat }}</div>
      <div class="timeline-body">
        <p class="timeline-title">
          <a href="#">{{ log.comment.title }}</a>
        </p>
        <p class="timeline-author">
          <a href="#">{{ log.created_at | timeFormat }}</a>
          <nuxt-link
            :to="`/people/users/details?id=${log.createdBy.id}`"
            class="tx-inverse"
            v-text="log.createdBy.name"
          ></nuxt-link>
          <span
            class="d-block"
            v-if="log.status.code == '20' && workRequest.responseTimeSlaInfo"
            :class="[
              `tx-${
                workRequest.responseTimeSlaInfo.timeExpended <
                workRequest.responseTimeSlaInfo.expectedDuration
                  ? 'success'
                  : 'danger'
              }`
            ]"
            >{{
              workRequest.responseTimeSlaInfo.timeExpended | readableTime
            }}/{{
              workRequest.responseTimeSlaInfo.expectedDuration | readableTime
            }}</span
          >
          <span
            class="d-block"
            v-if="log.status.code == '35' && workRequest.procurementSlaInfo"
            :class="[
              `tx-${
                workRequest.procurementSlaInfo.timeExpended <
                workRequest.procurementSlaInfo.expectedDuration
                  ? 'success'
                  : 'danger'
              }`
            ]"
            >{{ workRequest.procurementSlaInfo.timeExpended | readableTime }}/{{
              workRequest.procurementSlaInfo.expectedDuration | readableTime
            }}</span
          >
          <span
            class="d-block"
            v-if="log.status.code == '65' && workRequest.completionTimeSlaInfo"
            :class="[
              `tx-${
                workRequest.completionTimeSlaInfo.timeExpended <
                workRequest.completionTimeSlaInfo.expectedDuration
                  ? 'success'
                  : 'danger'
              }`
            ]"
            >{{
              workRequest.completionTimeSlaInfo.timeExpended | readableTime
            }}/{{
              workRequest.completionTimeSlaInfo.expectedDuration | readableTime
            }}</span
          >
          <span
            class="d-block"
            v-if="log.status.code == '105' && workRequest.approvalSlaInfo"
            :class="[
              `tx-${
                workRequest.approvalSlaInfo.timeExpended <
                workRequest.approvalSlaInfo.expectedDuration
                  ? 'success'
                  : 'danger'
              }`
            ]"
            >{{ workRequest.approvalSlaInfo.timeExpended | readableTime }}/{{
              workRequest.approvalSlaInfo.expectedDuration | readableTime
            }}</span
          >
          <span v-if="log.status.code == '35'">
            <span
              class="tx-warning d-block"
              v-for="(flag, index) in costingFlags"
              :key="`costing-flags-${index}`"
            >
              {{ flag }}
            </span></span
          >
        </p>
        <p class="timeline-text" v-text="log.comment.text"></p>
      </div>
      <!-- timeline-body -->
    </div>
    <!-- timeline-item -->
  </div>
  <!-- timeline-group -->
</template>

<script>
import timeFunctions from "@/mixins/timeFunctions";

export default {
  computed: {
    costingFlags() {
      var flags = [];
      if (this.quotations.length < 3 && this.quotations.length > 0)
        flags.push(`Only ${this.quotations.length} quotation uploaded. There should have
            been at least 3`);
      if (this.cheapestQuotation) {
        if (
          !["po-gen", "approved"].includes(this.cheapestQuotation.status.code)
        )
          flags.push(`The cheapest quotation was not selected`);
      }

      return flags;
    },
    cheapestQuotation() {
      if (this.quotations.length < 1) return null;
      const sortedQuotations = this.quotations.sort(
        (a, b) => a.total - b.total
      );
      return sortedQuotations[0];
    },
    quotations() {
      if (
        this.workRequest.tenderProcesses.length < 1 &&
        this.workRequest.salesOrders.length < 1
      )
        return [];
      var quotations = this.workRequest.tenderProcesses.reduce(
        (allQuotations, tenderProcess) =>
          allQuotations.concat(tenderProcess.quotations),
        []
      );
      if (this.workRequest.salesOrders.length > 0) {
        quotations = quotations.concat(
          this.workRequest.salesOrders.reduce((allQuotations, salesOrder) => {
            const salesOrderQuotations = salesOrder.tenderProcesses.reduce(
              (allSalesOrderQuotations, tenderProcess) =>
                allSalesOrderQuotations.concat(tenderProcess.quotations),
              []
            );
            return allQuotations.concat(salesOrderQuotations);
          }, [])
        );
      }
      return quotations;
    }
  },
  mixins: [timeFunctions],
  props: ["workRequest"]
};
</script>
