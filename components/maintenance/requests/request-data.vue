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
          <span v-if="!workRequest.unit.parent"> {{workRequest.unit.name}} </span>
          <span v-else>{{workRequest.unit.name}} ({{workRequest.unit.parent.name}})</span>
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
    <span class="tx-11 d-block" v-if="workRequest.sla">
      <span
      v-if="workRequest.status.name.toLowerCase().includes('complete')"
        :class="[
          `tx-${
            getCompletedTimeExpended() < slaData.expectedDuration
              ? 'success'
              : 'danger'
          }`
        ]"
      >
    
        {{
            getCompletedTimeExpended() | shortReadableTime
            
        }} /
        {{ slaData.expectedDuration | shortReadableTime }}
      </span>

      <span
      v-if="!workRequest.status.name.toLowerCase().includes('complete')"
        :class="[
          `tx-${
            (new Date().getTime() -
                Date.parse(workRequest.created_at))< slaData.expectedDuration
              ? 'success'
              : 'danger'
          }`
        ]"
      >
        {{
          
              (new Date().getTime() -
                Date.parse(workRequest.created_at))
              | shortReadableTime
        }}/
          {{ slaData.expectedDuration | shortReadableTime }}
      </span>
      <!-- <span
        class="square-8 mg-r-5 rounded-circle"
        :class="[`bg-${priorityClasses[workRequest.sla.priority.code]}`]"
      ></span> -->
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
    getCompletedTimeExpended () {
      let requestTime

      for (let i = 0; i < this.workRequest.logs.length; i++) {
        if (this.workRequest.logs[i].status.code == 65) {
          requestTime = this.workRequest.logs[i].created_at
         
        }
      }
    
      return Date.parse(requestTime) - Date.parse(this.workRequest.created_at)
      
    }
  },
  mixins: [authMixin, slaMixin, timeFunctions],
  props: ["workRequest"]
};
</script>
