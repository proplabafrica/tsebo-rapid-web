<template>
  <div class="table-responsive">
    <v-paginate class="bg-white" :list="workRequests" perPage="50">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table mg-b-0 tx-13">
            <thead>
              <tr class="work-request">
                <th class="pd-y-5 wd-250">
                  <span>Title</span>
                </th>
                <th class="pd-y-5 tx-center">
                  <span>Pending</span>
                </th>
                <th class="pd-y-5 tx-center">
                  <span>Planning</span>
                </th>
                <th class="pd-y-5 tx-center">
                  <span>Kicked Off</span>
                </th>
                <th class="pd-y-5 tx-center">
                  <span>Done</span>
                </th>
                <th class="pd-y-5 tx-center wd-180">
                  <span>Rating</span>
                </th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr
                class="work"
                v-for="workRequest in paginate.list"
                :key="workRequest.id"
              >
                <td>
                  <quick-request-data :workRequest="workRequest" />
                </td>
                <td class="p-0 pt-1 border-left tx-center">
                  <div
                    class="work-order pt-2 mt-4"
                    :class="statusCompletion(workRequest, '01')"
                  ></div>
                  <div class="work-time pl-2">
                    <span
                      v-text="
                        secondsToReadableTime(
                          timeToClientRequestApproval(workRequest)
                        )
                      "
                    ></span>
                  </div>
                </td>
                <td class="p-0 pt-1 tx-center">
                  <div
                    class="work-order pt-2 mt-4"
                    :class="statusCompletion(workRequest, '01')"
                  ></div>
                  <div
                    class="work-time pl-2"
                    v-if="
                      elapsedTimeBetweenStatuses(workRequest, '01', '60') > 0
                    "
                  >
                    <span
                      v-text="
                        secondsToReadableTime(
                          elapsedTimeBetweenStatuses(workRequest, '01', '60')
                        )
                      "
                    ></span>
                  </div>
                </td>
                <td class="p-0 pt-1 tx-center">
                  <div
                    class="work-order pt-2 mt-4"
                    :class="statusCompletion(workRequest, '60')"
                  ></div>
                  <div
                    class="work-time pl-2"
                    v-if="
                      elapsedTimeBetweenStatuses(workRequest, '60', '65') > 0
                    "
                  >

                    <span
                      v-text="
                        secondsToReadableTime(
                          elapsedTimeBetweenStatuses(workRequest, '60', '65')
                        )
                      "
                    ></span>
                  </div>
                </td>
                <td class="p-0 pt-1 border-right tx-center">
                  <div
                    class="work-order pt-2 mt-4"
                    :class="statusCompletion(workRequest, '65')"
                  ></div>
                </td>
                <td class="valign-middle">
                  <div
                    class="work-time pl-2"
                    v-if="
                      elapsedTimeBetweenStatuses(workRequest, '01', '65') > 0
                    "
                  >
                    <rate-job
                      class="mg-l-5"
                      v-if="workRequest.status.code == '65'"
                      v-action-show="'work-requests.rate-job'"
                      :workRequest="workRequest"
                      @update="updateWorkRequest()"
                    />
                    <span
                      v-for="ratingData in workRequest.ratings"
                      :key="ratingData.id"
                    >
                      <star-rating
                        class="tx-20"
                        :rangeArray="[1, 2, 3, 4, 5]"
                        :rating="ratingData.rating"
                      />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <th colspan="4">
                  <h5>No data to display</h5>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import slaMixin from "@/mixins/performance/sla";
import starRating from "@/components/ui/star-rating";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: {
    starRating,
    quickRequestData,
    vPaginate,
    "rate-job": () => import("@/components/maintenance/requests/rate-job")
  },
  data: () => ({
    loading: true,
    shouldRefresh: true,
    workRequest: null
  }),
  methods: {
    statusCompletion(workRequest, statusCode) {
      var statusCodeLogs = workRequest.logs.filter(log => {
        const status = log.status ? log.status : { code: "01" };
        return status.code == statusCode;
      });
      return statusCodeLogs.length > 0
        ? "completed"
        : statusCode == "01"
        ? "completed"
        : "pending";
    },
    elapsedTimeByStatusCode(workRequest, statusCode) {
      var startTime = new Date(workRequest.created_at);
      var endTime = Date.now();
      if (statusCode == "01") {
        endTime = startTime;
      } else {
        var statusCodeLog = workRequest.logs.find(log => {
          const status = log.status ? log.status : { code: "01" };
          return status.code == statusCode;
        });
        if (statusCodeLog) endTime = new Date(statusCodeLog.created_at);
      }

      return (endTime - startTime) / 1000;
    },
    elapsedTimeBetweenStatuses(
      workRequest,
      startingStatusCode,
      endingStatusCode
    ) {
      var startTime = this.elapsedTimeByStatusCode(
        workRequest,
        startingStatusCode
      );
      var endTime = this.elapsedTimeByStatusCode(workRequest, endingStatusCode);

      return endTime - startTime;
    },
    secondsToReadableTime(seconds) {
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      return days + " days, " + hrs + " Hrs, " + mnts + " Minutes";
    },
    timeToClientRequestApproval(workRequest) {
      const clientRequest = workRequest.clientRequest;
      if (!clientRequest) return 0;
      const startTime = new Date(clientRequest.created_at);
      const endTime = new Date(workRequest.created_at);
      return endTime - startTime;
    },
    updateWorkRequest() {
      this.$parent.reloadWorkRequests();
    }
  },
  mixins: [authMixin],
  props: ["workRequests"]
};
</script>
