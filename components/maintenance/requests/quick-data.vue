<template>
  <div>
    <nuxt-link
      :to="
        linkCheck(
          'work-requests.show',
          `/maintenance/requests/details?id=${workRequest.id}`
        )
      "
      class="tx-inverse tx-lowercase tx-14 tx-medium d-block"
      style="
        max-width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      "
      >{{ ellipse(workRequest.name, 40) }}</nuxt-link
    >
    <nuxt-link to="#" class="tx-inverse tx-uppercase">
      <span class="tx-11">
        <nuxt-link
          v-if="workRequest.unit"
          :to="
            linkCheck(
              'units.show',
              `/location/units/details?id=${workRequest.unit.id}`
            )
          "
          class="tx-inverse d-block"
        >
          <span v-if="!workRequest.unit.parent">
            {{ workRequest.unit.name }}
          </span>
          <span v-else
            >{{ workRequest.unit.name }} ({{
              workRequest.unit.parent.name
            }})</span
          >
          <!-- {{ ellipse(workRequest.unit.name, 20) }} -->
          <!-- <span
            class="d-block"
            v-if="workRequest.unit.parent"
          >({{ workRequest.unit.parent.code }})</span> -->
        </nuxt-link>
        <nuxt-link
          v-for="invoice in workRequest.invoices"
          :key="invoice.id"
          :to="
            linkCheck(
              'invoices.show',
              `/finance/invoices/details?id=${invoice.id}`
            )
          "
          :class="invoiceClasses(invoice)"
        >
          {{ invoice.status.name }} ({{ invoice.code }})
        </nuxt-link>
      </span>
    </nuxt-link>
    <span class="tx-11 d-block" v-if="workRequest.priority">
      <span
        class="square-8 mg-r-5 rounded-circle"
        :class="[`bg-${classByPriority(workRequest.priority)}`]"
      ></span>
      <span>{{ workRequest.priority.name }}</span>
    </span>
    <span class="tx-11 d-block" v-if="workRequest.slaInfo">
      <span
        class="d-block"
        :class="[
          `tx-${
            workRequest.slaInfo.timeExpended <
            workRequest.slaInfo.expectedDuration
              ? 'success'
              : 'danger'
          }`
        ]"
        >{{ workRequest.slaInfo.timeExpended | shortReadableTime }} /
        {{ workRequest.slaInfo.expectedDuration | shortReadableTime }}</span
      >
      <span
        class="square-8 mg-r-5 rounded-circle"
        :class="[`bg-${priorityClasses[workRequest.sla.priority.code]}`]"
      ></span>
      <span>{{ workRequest.sla.name }}</span>
      <i
        v-if="workRequest.status.code == '105'"
        class="icon ion-ios-checkmark tx-success"
        style="float: right"
      ></i>
    </span>
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import slaMixin from "@/mixins/performance/sla";
import timeFunctions from "@/mixins/timeFunctions";

export default {
  methods: {
    classByPriority(priority) {
      return priority.code == "P1" || priority.code == "P2"
        ? "danger"
        : priority.code == "P3" || priority.code == "P5"
        ? "info"
        : "warning";
    },
    invoiceClasses(invoice) {
      return invoice.status.code == "approved"
        ? ["tx-success"]
        : ["tx-warning"];
    }
  },
  mixins: [authMixin, slaMixin, timeFunctions],
  props: ["workRequest"]
};
</script>
