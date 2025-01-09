<template>
  <div class="container">
    <div class="wrapper" @click="openModal" v-if="!showModal">
      <img src="/img/download.png" class="spool-download" />
    </div>
    <div class="modal fade show" v-if="showModal">
      <div class="modal-dialog wd-300 wd-sm-500">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <div>
              <form class="body pd-20">
                <div class="header">
                  <h3 class="slim-card-title">REPORT SPOOLING</h3>
                  <button class="close" @click="openModal">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <label class="form-control-label">Category:</label>
                <select name="spool-type" class="spool-type form-control" selectOnTab
                  v-on:change="changeDataPoint($event)">
                  <option value="work">Work Order</option>
                  <option v-if="canSpoolVendors" value="vendor">
                    Vendor List
                  </option>
                  <option value="material">Material Inventory</option>
                  <option value="purchase">Purchase Orders</option>
                  <option value="sales">Sales Orders</option>
                  <option value="ppm">PPM List</option>
                  <option value="technician">Technician Ratings</option>
                  <option value="generator">Generator Report</option>
                </select>

                <label class="form-control-label" v-if="dataPoint == 'work'">Status:</label>
                <select name="spool-work-by" class="spool-type form-control" v-on:change="changeWorkType($event)"
                  v-if="dataPoint == 'work'">
                  <option value="all">All</option>
                  <option value="work-not-started">Not Started</option>
                  <option value="work-started">Started</option>
                  <option value="work-completed">Completed</option>
                </select>

                <label class="form-control-label" v-if="hasUnit">Facility</label>
                <select name="spool-type" class="spool-type form-control" v-on:change="changeUnit($event)" v-if="hasUnit">
                  <option value="all">All</option>
                  <option v-for="unit in units" :key="unit.id" v-text="`${unit.name} ${unit.parent ? ` - ${unit.parent.name}` : ''
                    }`
                    " :value="`${unit.name} - ${unit.id}`"></option>
                </select>

                <label class="form-control-label">Choose Period</label>
                <div style="display: flex; cursor: pointer">
                  <p style="margin-right: 10px; margin-top: 10px" @click="!openDate" @dblclick="!shouldOpenDate">
                    From:
                  </p>
                  <input v-if="range.start" class="spool-type input form-control" style="width: 40%"
                    :value="range.start.toDateString()" @click="openDate" />
                  <input v-else class="spool-type input form-control" style="width: 40%" :value="range.start"
                    @click="openDate" />
                  <p style="
                      margin-left: 20px;
                      margin-right: 10px;
                      margin-top: 10px;
                    ">
                    To:
                  </p>
                  <input v-if="range.end" @click="openDateTo" class="spool-type input form-control" style="width: 40%"
                    :value="range.end.toDateString()" />
                  <input v-else @click="openDateTo" class="spool-type input form-control" style="width: 40%"
                    :value="range.end" />
                </div>

                <div class="date" v-if="shouldOpenDate">
                  <DatePicker v-model="range.start" @input="setRangeFrom"></DatePicker>
                </div>
                <div class="date" v-if="shouldOpenDateTo">
                  <DatePicker v-model="range.end" @input="setRangeTo"></DatePicker>
                </div>

                <label class="form-control-label">Choose Type</label>
                <select class="spool-type form-control" v-on:change="changeDownloadType($event)">
                  <option value="csv">CSV</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </form>
              <div class="footer tx-center mg-t-20 form-layout-footer">
                <div v-if="(dataPoint === 'work' &&
                  !workRequestsLoading &&
                  !usersLoading) ||
                  (dataPoint === 'vendor' && !vendorsLoading) ||
                  (dataPoint === 'material' && !materialsLoading) ||
                  (dataPoint === 'purchase' && !purchaseOrdersLoading) ||
                  (dataPoint === 'sales' && !salesOrdersLoading) ||
                  (dataPoint === 'ppm' && !maintenanceCyclesLoading) ||
                  (dataPoint === 'technician' &&
                    !technicianFeedbacksLoading) ||
                  (dataPoint === 'generator' && !generatorReadingsLoading)
                  " class="btn btn-primary" @click="download()">
                  <span>DOWNLOAD</span>
                </div>
                <div v-else class="btn btn-primary">
                  <span :disable="true">LOADING...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { orderBy } from "lodash";
import { mapActions } from "vuex";
import iotMixin from "@/mixins/iot/readings";
import timeFunctions from "@/mixins/timeFunctions";

export default {
  components: {
    Calendar,
    DatePicker
  },

  data: () => ({
    propelFmGroundTankReadings: [],
    propelFmGroundTankReadingsRangeBy: null,
    propelFmGroundTankReadingsRangeFrom: null,
    propelFmGroundTankReadingsRangeTo: null,
    generatorReadingsLoading: false,
    generatorTank: "Justitia Tank One",
    tankDailyConsumption: null,
    metroUnderheadTankReadings: [],
    sensors: [],
    sensorsLoading: false,
    technicianFeedbacksLoading: false,
    technicianFeedbacks: [],
    technicianFeedbacksUnitId: null,
    technicianFeedbacksRangeBy: null,
    technicianFeedbacksRangeFrom: null,
    technicianFeedbacksRangeTo: null,
    maintenanceCyclesUnitId: null,
    maintenanceCycleSearch: null,
    maintenanceCyclesRangeBy: null,
    maintenanceCyclesRangeFrom: null,
    maintenanceCyclesRangeTo: null,
    salesOrdersUnitId: null,
    salesOrdersRangeBy: null,
    salesOrdersRangeFrom: null,
    salesOrdersRangeTo: null,
    purchaseOrdersRangeBy: null,
    purchaseOrdersRangeFrom: null,
    purchaseOrdersRangeTo: null,
    materialsRangeBy: null,
    materialsRangeFrom: null,
    materialsRangeTo: null,
    workRequestsRangeBy: null,
    workRequestsRangeFrom: null,
    workRequestsRangeTo: null,
    vendorsRangeBy: null,
    vendorsRangeFrom: null,
    vendorsRangeTo: null,
    workRequestsUnitId: null,
    workRequestStatusCodes: [],
    name: "",
    showModal: false,
    canSpoolVendors: false,
    shouldOpenDate: false,
    shouldOpenDateTo: false,
    item: null,
    vendors: [],
    vendorsLoading: false,
    tunedVendors: [],
    salesOrders: [],
    salesOrdersLoading: true,
    tunedSalesOrders: [],
    workOrder: [],
    tunedWorkOrder: [],
    users: [],
    usersLoading: false,
    workRequestsLoading: false,
    workRequestsPerPage: null,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "asc",
    tunedPurchaseOrders: [],
    units: [],
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    loading: false,
    maintenanceCycles: [],
    allRequests: [],
    maintenanceCyclesLoading: true,
    range: {
      start: null,
      end: null
    },
    materials: [],
    materialsLoading: false,
    tunedMaterials: [],
    ppm: [],
    tunedPPM: [],
    dataPoint: "work",
    search: "",
    showItemPrice: false,
    downloadType: "csv",
    hasUnit: true,
    relatedUnitsSales: [],
    currentUnit: "all",
    workRequests: [],
    work: [],
    started: [],
    completed: [],
    workOrderType: "all",
    allWorkRequests: [],
    technicians: [],
    technicianLoading: true
  }),
  props: ["authUser"],
  async created() {
    this.getWorkRequests(this);
    this.getSalesOrders(this);
    this.getMaterials(this);
    this.getMaintenanceCycles(this);
    this.getPurchaseOrders(this);
    this.getUnits();
    this.getVendors(this);
    this.getTechnicianFeedbacks(this);
    // this.getSensors(this);
    // this.getGeneratorData();
    const systemFunctionCodes = this.authUser.roles
      .reduce((functions, role) => functions.concat(role.systemFunctions), [])
      .map((systemFunction) => systemFunction.code);

    this.canSpoolVendors = systemFunctionCodes.includes("vendors.index");
  },

  computed: {
    workRequestsData() {

      return this.workRequests.length
        ? this.workRequests.map((workRequest) => {

          // console.log("code..", workRequest.code, workRequest.name)

          let facilityManagers = [];
          let procurementOfficers = [];
          let workRequestUsers = [];

          for (const log of workRequest.logs.filter((log) => log.createdBy)) {
            var lastPerson = workRequestUsers.slice(-1).pop();
            lastPerson = lastPerson ? lastPerson : { id: null };
            if (lastPerson.id != log.createdBy.id) {
              workRequestUsers.push(log.createdBy);
            }
          }
          if (workRequestUsers.length) {
            for (let i = 0; i < workRequestUsers.length; i++) {
              const user = workRequestUsers[i];
              if (
                user.roles.find((role) => role.name === "Facility Manager")
              ) {
                facilityManagers.push(user);
              }
              if (
                user.roles.find((role) => role.name === "Procurement Officer")
              ) {
                procurementOfficers.push(user);
              }
            }
          }
          facilityManagers = [
            ...new Set(facilityManagers.map((fm) => fm.name))
          ];
          procurementOfficers = [
            ...new Set(procurementOfficers.map((po) => po.name))
          ];

          const workRequestSla = this.slaTotalData(workRequest);
          let slaTimeline = `${this.secondsToReadableTime(
            workRequestSla.timeExpended / 1000,
            ["day", "week", "year"],
            "long"
          )}/${this.secondsToReadableTime(
            workRequestSla.expectedDuration / 1000,
            ["day", "week", "year"],
            "long"
          )}`;
          let approvalSla = workRequestSla.approvalSlaInfo
            ? `${this.readableTime(
              workRequestSla.approvalSlaInfo.timeExpended,
              ["day", "week", "year"],
              "long"
            )}/${this.readableTime(
              workRequestSla.approvalSlaInfo.expectedDuration,
              ["day", "week", "year"],
              "long"
            )}`
            : `N/A`;
          let procurementSla = workRequestSla.procurementSlaInfo
            ? `${this.readableTime(
              workRequestSla.procurementSlaInfo.timeExpended,
              ["day", "week", "year"],
              "long"
            )}/${this.readableTime(
              workRequestSla.procurementSlaInfo.expectedDuration,
              ["day", "week", "year"],
              "long"
            )}`
            : `N/A`;
          let operationsSla = workRequestSla.operationsSlaInfo
            ? `${this.readableTime(
              workRequestSla.operationsSlaInfo.timeExpended,
              ["day", "week", "year"],
              "long"
            )}/${this.readableTime(
              workRequestSla.operationsSlaInfo.expectedDuration,
              ["day", "week", "year"],
              "long"
            )}`
            : `N/A`;
          
          // console.log("good", slaTimeline)
          // return 
          return {
            CODE: workRequest.code,
            // "SERVICE NAME": workRequest.name.replace(/\s*,\s*/g, ', ').split(",").map(part => part.trim()).filter(part => part.length > 0).join(", "),
            "SERVICE NAME": workRequest.name.replace(/,\s*/g, '').replace(/\s+/g, ' ').trim(),
            DESCRIPTION: workRequest.description ? workRequest.description.replace(/,\s*/g, '').replace(/\s+/g, ' ').trim() : null,
            "FACILITY MANAGER(S)": facilityManagers.length ? facilityManagers.map(name => name.trim()).join(" ") : facilityManagers ? facilityManagers : "N/A",
            "PROCUREMENT OFFICER(S)": procurementOfficers.length ? procurementOfficers.map(name => name.trim()).join(" ") : procurementOfficers ? procurementOfficers : "N/A",
            "SLA TIMELINE": slaTimeline,
            "APPROVAL SLA": approvalSla,
            "PROCUREMENT SLA": procurementSla,
            "OPERATIONS SLA": operationsSla,
            "SLA STATUS":
              workRequestSla.procurementSlaInfo === null
                ? "N/A"
                : workRequestSla.procurementSlaInfo.timeExpended <
                  workRequestSla.procurementSlaInfo.expectedDuration
                  ? "ACTIVE"
                  : workRequestSla.procurementSlaInfo.timeExpended <=
                    workRequestSla.procurementSlaInfo.expectedDuration &&
                    (workRequest.status.name === "Complete Ready for Review" ||
                      workRequest.status.name === "Reviewed Complete")
                    ? "PASSED"
                    : "FAILED",
            FACILITY: workRequest.unit
              ? workRequest.unit.parent
                ? workRequest.unit.parent.name
                : workRequest.unit.name
              : "N/A",
            UNIT: workRequest.unit ? workRequest.unit.name : null,
            STATUS: workRequest.status ? workRequest.status.name : "N/A",
            "DATE CREATED": workRequest.created_at,
          };
        })
        : [
          {
            CODE: "N/A",
            "SERVICE NAME": "N/A",
            DESCRIPTION: "N/A",
            "SLA TIMELINE": "N/A",
            "APPROVAL SLA": "N/A",
            "PROCUREMENT SLA": "N/A",
            "OPERATIONS SLA": "N/A",
            "SLA STATUS": "N/A",
            FACILITY: "N/A",
            UNIT: "N/A",
            STATUS: "N/A",
            "DATE CREATED": "N/A",
          }
        ];
    },
    vendorsData() {
      return this.vendors.length
        ? this.vendors.map((vendor) => {
          return {
            NAME: vendor.business_name,
            EMAIL: vendor.business_email,
            PHONE: vendor.business_phone,
            TRADE: vendor.trades.length ? vendor.trades[0].name : "N/A",
            "DATE ADDED": vendor.created_at
          };
        })
        : [
          {
            NAME: "N/A",
            EMAIL: "N/A",
            PHONE: "N/A",
            TRADE: "N/A",
            "DATE ADDED": "N/A"
          }
        ];
    },
    materialsData() {
      return this.materials.length
        ? this.materials.map((material) => {
          return {
            "MATERIAL CODE": material.code,
            NAME: material.name,
            CATEGORIES: material.categories.length
              ? material.categories[0].name
              : "N/A",
            STOCK: material.stock
          };
        })
        : [
          {
            "MATERIAL CODE": "N/A",
            NAME: "N/A",
            CATEGORIES: "N/A",
            STOCK: "N/A"
          }
        ];
    },
    purchaseOrdersData() {
      return this.purchaseOrders.length
        ? this.purchaseOrders.map((purchaseOrder) => {
          const purchaseOrderItems = purchaseOrder.items
            ? purchaseOrder.items
            : [];
          let requestName = null;
          let workRequests = null;
          for (let i = 0; i < purchaseOrderItems.length; i++) {
            if (
              purchaseOrder.id === purchaseOrderItems[i].purchase_order_id
            ) {
              const salesOrders =
                purchaseOrder?.quotation?.tenderProcess?.salesOrders;
              workRequests = salesOrders?.[0]?.workRequests;
              requestName = workRequests?.[0]?.name || "N/A";
              break;
            }
          }
          return {
            "ORDER #": purchaseOrder.code,
            "SERVICE NAME": requestName,
            FACILITY: workRequests ? workRequests[0]?.unit.name : "N/A",
            VENDOR: purchaseOrder.vendor.business_name,
            "TOTAL ORDER": this.money(purchaseOrder.total),
            "CREATED BY": purchaseOrder.createdBy.name,
            "DATE CREATED": new Date(
              purchaseOrder.created_at
            ).toLocaleString(),
            STATUS: purchaseOrder.status.name
          };
        })
        : [
          {
            "ORDER #": "N/A",
            "SERVICE NAME": "N/A",
            FACILITY: "N/A",
            VENDOR: "N/A",
            "TOTAL ORDER": "N/A",
            "CREATED BY": "N/A",
            "DATE CREATED": "N/A",
            STATUS: "N/A"
          }
        ];
    },
    salesOrdersData() {
      const salesOrders =
        this.salesOrdersUnitId && this.salesOrders.length
          ? this.salesOrders.filter(
            (salesOrder) =>
              salesOrder.workRequests[0]?.unit_id === this.salesOrdersUnitId
          )
          : this.salesOrders;

      return salesOrders.length
        ? salesOrders.map((salesOrder) => {
          const unit = salesOrder?.workRequests[0]?.unit;
          return {
            "ORDER #": salesOrder.code,
            "SERVICE NAME": salesOrder.workRequests.length
              ? salesOrder.workRequests[0]?.name
              : "N/A",
            FACILITY: unit ? unit.name : "N/A",
            "CREATED BY": salesOrder.createdBy.name,
            "DATE CREATED": new Date(salesOrder.created_at).toLocaleString(),
            STATUS: salesOrder.status.name
          };
        })
        : [
          {
            "ORDER #": "N/A",
            "SERVICE NAME": "N/A",
            FACILITY: "N/A",
            "CREATED BY": "N/A",
            "DATE CREATED": "N/A",
            STATUS: "N/A"
          }
        ];
    },
    maintenanceCyclesData() {
      const maintenanceCycles =
        this.maintenanceCyclesUnitId && this.maintenanceCycles.length
          ? this.maintenanceCycles.filter(
            (maintenanceCycle) =>
              maintenanceCycle.workRequests[0]?.unit_id ===
              this.maintenanceCyclesUnitId
          )
          : this.maintenanceCycles;

      return maintenanceCycles.length
        ? maintenanceCycles.map((maintenanceCycle) => {
          return {
            CODE: maintenanceCycle.schedule.code,
            "ROUTINE NAME": maintenanceCycle.schedule.plan.name,
            "CYCLE #": maintenanceCycle.cycle_count,
            FREQUENCY: `${maintenanceCycle.schedule.plan.frequency} ${maintenanceCycle.schedule.plan.frequencyMeasurement.name}`,
            FACILITY: maintenanceCycle.schedule.unit.name,
            "DATE CREATED": new Date(
              maintenanceCycle.created_at
            ).toLocaleString()
          };
        })
        : [
          {
            CODE: "N/A",
            "ROUTINE NAME": "N/A",
            "CYCLE #": "N/A",
            FREQUENCY: `N/A`,
            FACILITY: "N/A",
            "DATE CREATED": "N/A"
          }
        ];
    },
    techniciansFeedbackData() {
      const technicianFeedbacks = this.technicianFeedbacks.length
        ? this.technicianFeedbacks.filter(
          (technicianFeedback) => technicianFeedback.technicians.length > 0
        )
        : [];
      return technicianFeedbacks
        ? technicianFeedbacks.map((technicianFeedback) => {
          return {
            "TECHNICIAN NAME": technicianFeedback.technicians[0].user.name,
            "SERVICE NAME": technicianFeedback.task.workRequests[0].name,
            TRADE: technicianFeedback.technicians[0].trades[0].name,
            STATUS: technicianFeedback.task.workRequests[0].status.name,
            "DATE CREATED": technicianFeedback.task.workRequests[0].created_at
          };
        })
        : [
          {
            "TECHNICIAN NAME": "N/A",
            "SERVICE NAME": "N/A",
            TRADE: "N/A",
            STATUS: "N/A",
            "DATE CREATED": "N/A"
          }
        ];
    },
    generatorMetricsData() {
      let generatorMetricsData = [];
      this.generatorReadingsLoading = true;
      const generatorConsumptionDataSheet = (dailyConsumptionObject) => {
        for (const key in dailyConsumptionObject) {
          generatorMetricsData.push({
            DAY: key,
            TANK: this.generatorTank,
            "CONSUMPTION lTR(S)": dailyConsumptionObject[key],
            "GEN RUNTIME": "N/A"
          });
        }
      };
      if (this.generatorTank === "Justitia Tank One") {
        generatorConsumptionDataSheet(this.propelFmGroundTankReadings);
      } else if (this.generatorTank === "Metro gardens underground tank") {
        generatorConsumptionDataSheet(this.metroUnderheadTankReadings);
      }
      this.generatorReadingsLoading = false;
      return generatorMetricsData;
    }
  },
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests",
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders",
      getSalesOrders: "hagul/inventory/salesOrders/getSalesOrders",
      // getSensors: "iot/sensors/getSensors",
      getMaterials: "hagul/inventory/materials/getMaterials",
      getVendors: "people/vendors/getVendors",
      getMaintenanceCycles:
        "maintenance/maintenanceCycles/getMaintenanceCycles",
      getTechnicianFeedbacks:
        "performance/technicianFeedbacks/getTechnicianFeedbacks"
    }),
    async download() {
      if (this.downloadType === "xlsx") {
        switch (this.dataPoint) {
          case "work":
            this.xlsxHelper(
              this.workRequestsData,
              "work-requests",
              "Work Requests Sheet"
            );
            break;
          case "vendor":
            this.xlsxHelper(this.vendorsData, "vendors", "Vendor List Sheet");
            break;
          case "material":
            this.xlsxHelper(
              this.materialsData,
              "materials",
              "Material List Sheet"
            );
            break;
          case "purchase":
            this.xlsxHelper(
              this.purchaseOrdersData,
              "purchaseOrders",
              "Purchase Orders Sheet"
            );
            break;
          case "sales":
            this.xlsxHelper(
              this.salesOrdersData,
              "salesOrders",
              "Sales Orders Sheet"
            );
            break;
          case "ppm":
            this.xlsxHelper(
              this.maintenanceCyclesData,
              "job-schedules",
              "Preventive Maintenance Sheet"
            );
            break;
          case "technician":
            this.xlsxHelper(
              this.techniciansFeedbackData,
              "technician-report",
              "Technicians Report Sheet"
            );
            break;
          case "generator":
            this.xlsxHelper(
              this.generatorMetricsData,
              "generator-report",
              "Generator Report Sheet"
            );
            break;
          default:
            break;
        }
      } else if (this.downloadType === "csv") {
        switch (this.dataPoint) {
          case "work":
            this.downloadCSV(this.workRequestsData, "work-request");
            break;
          case "vendor":
            this.downloadCSV(this.vendorsData, "vendors");
            break;
          case "material":
            this.downloadCSV(this.materialsData, "materials");
            break;
          case "purchase":
            this.downloadCSV(this.purchaseOrdersData, "purchase-orders");
            break;
          case "sales":
            this.downloadCSV(this.salesOrdersData, "sales-orders");
            break;
          case "ppm":
            this.downloadCSV(this.maintenanceCyclesData, "job-schedules");
            break;
          case "technician":
            this.downloadCSV(
              this.techniciansFeedbackData,
              "technicians-feedback"
            );
            break;
          case "generator":
            this.downloadCSV(this.generatorMetricsData, "generator-report");
            break;
          default:
            break;
        }
      }
    },
    async getGeneratorData() {
      this.generatorReadingsLoading = true;
      const promise1 = await this.getPropelFmGroundTankReadings({
        associations: ["sensor"],
        byUnitId: null,
        rangeBy: null,
        rangeFrom: null,
        rangeTo: null
      });
      // const promise2 = 42;
      // const promise2 = await this.getMetroUnderheadTankReadings({
      //   associations: ["sensor"],
      //   byUnitId: null,
      //   rangeBy: null,
      //   rangeFrom: null,
      //   rangeTo: null,
      // });
      Promise.all([promise1, promise2])
        .then((results) => {
          this.propelFmGroundTankReadings = this.getGeneratorMetrics(
            results[0]
          );
          // this.metroUnderheadTankReadings = this.getGeneratorMetrics(
          //   results[1]
          // );
          this.generatorReadingsLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    shortReadableTime(timeInMilliseconds) {
      return this.secondsToReadableTime(
        timeInMilliseconds / 1000,
        ["minute", "hour", "day", "week", "year"],
        "short"
      );
    },
    secondsToReadableTime(seconds, units, toString = null) {
      units = orderBy(this.getTimeUnitsInSeconds(units), ["value"], ["desc"]);
      const results = [];
      units.forEach((unit) => {
        const unitValue = Math.floor(seconds / unit.value);
        seconds -= unitValue * unit.value;
        if (unitValue > 0) {
          results.push({
            name: unit.name,
            value: unitValue
          });
        }
      });
      if (toString == "long") {
        var text = "";
        results.forEach((result) => {
          text += `${result.value} ${result.name}(s) `;
        });
        return text;
      }
      if (toString == "short") {
        var text = "";
        results.forEach((result) => {
          name = result.name.substring(0, 1);
          text += `${result.value} ${name} `;
        });
        return text;
      }
      return results;
    },
    getTimeUnits(units) {
      const timeUnits = [
        { name: "minute", value: 1 / 60 },
        { name: "hour", value: 1 },
        { name: "day", value: 24 },
        { name: "week", value: 24 * 7 },
        { name: "year", value: 24 * 365.25 }
      ];

      return timeUnits.filter((timeUnit) => {
        return units.includes(timeUnit.name);
      });
    },
    getTimeUnitsInSeconds(units) {
      return this.getTimeUnits(units).map((unit) => {
        unit.value *= 3600;
        return unit;
      });
    },
    slaTotalData(workRequest) {
      const createdAt = Date.parse(workRequest.created_at);
      const expectedDuration = this.slaDuration(workRequest.sla);
      const dueAt = createdAt + expectedDuration;
      const timeExpended = Date.now() - createdAt;
      const timeLeft = dueAt - Date.now();

      return {
        createdAt,
        expectedDuration,
        dueAt,
        timeExpended,
        timeLeft,
        procurementSlaInfo: workRequest.procurementSlaInfo,
        operationsSlaInfo: workRequest.operationsSlaInfo,
        completionTimeSlaInfo: workRequest.completionTimeSlaInfo,
        approvalSlaInfo: workRequest.approvalSlaInfo
      };
    },
    slaDuration(sla) {
      const timeUnits = this.getTimeUnitsInSeconds([
        "minute",
        "hour",
        "day",
        "week",
        "year"
      ]);
      if (!sla?.measurement) return 0;

      return (
        parseFloat(sla.expected_time) *
        timeUnits.find(
          (unit) => unit.name == sla?.measurement.code.slice(0, -1)
        ).value *
        1000
      );
    },
    changeDownloadType(event) {
      let type = event.target?.value;
      if (type == "csv") {
        this.downloadType = "csv";
      } else if (type == "xlsx") {
        this.downloadType = "xlsx";
      }
    },
    async getUnits() {
      const response = await this.$axios.get("units", {
        params: { associations: ["parent"] }
      });
      this.units = response.data.data;
    },
    async setRangeFrom() {
      switch (this.dataPoint) {
        case "work":
          this.workRequestsRangeBy = "created_at";
          this.workRequestsRangeFrom = this.range.start;
          this.$store.commit("maintenance/workRequests/toggleRefresh");
          this.getWorkRequests(this);
          break;
        case "vendor":
          this.vendorsRangeBy = "created_at";
          this.vendorsRangeFrom = this.range.start;
          this.$store.commit("people/vendors/toggleRefresh");
          this.getVendors(this);
          break;
        case "material":
          this.materialsRangeBy = "created_at";
          this.materialsRangeFrom = this.range.start;
          this.$store.commit("hagul/inventory/materials/toggleRefresh");
          this.getMaterials(this);
          break;
        case "purchase":
          this.purchaseOrdersRangeBy = "created_at";
          this.purchaseOrdersRangeFrom = this.range.start;
          this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
          this.getPurchaseOrders(this);
          break;
        case "sales":
          this.salesOrdersRangeBy = "created_at";
          this.salesOrdersRangeFrom = this.range.start;
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.getSalesOrders(this);
          break;
        case "ppm":
          this.maintenanceCyclesRangeBy = "created_at";
          this.maintenanceCyclesRangeFrom = this.range.start;
          this.$store.commit("maintenance/maintenanceCycles/toggleRefresh");
          this.getMaintenanceCycles(this);
          break;
        case "technician":
          this.technicianFeedbacksRangeBy = "created_at";
          this.technicianFeedbacksRangeFrom = this.range.start;
          this.$store.commit("performance/technicianFeedbacks/toggleRefresh");
          this.getTechnicianFeedbacks(this);
          break;
        case "generator":
          this.generatorReadingsLoading = true;
          if (this.generatorTank === "Justitia Tank One") {
            this.generatorReadingsLoading = true;
            const propelFmGroundTankReadings =
              await this.getPropelFmGroundTankReadings({
                associations: ["sensor"],
                page: 1,
                perPage: 10000,
                byUnitId: null,
                rangeBy: "created_at",
                rangeFrom: this.range.start,
                rangeTo: this.range.end ? this.range.end : this.range.start
              });
            this.propelFmGroundTankReadings = [];
            this.propelFmGroundTankReadings = this.getGeneratorMetrics(
              propelFmGroundTankReadings
            );
            this.generatorReadingsLoading = false;
          } else if (this.generatorTank === "Metro gardens underground tank") {
            this.generatorReadingsLoading = true;
            const metroUnderheadTankReadings =
              await this.getPropelFmGroundTankReadings({
                associations: ["sensor"],
                page: 1,
                perPage: 10000,
                byUnitId: null,
                rangeBy: "created_at",
                rangeFrom: this.range.start,
                rangeTo: this.range.end ? this.range.end : this.range.start
              });
            this.metroUnderheadTankReadings = [];
            this.metroUnderheadTankReadings = this.getGeneratorMetrics(
              metroUnderheadTankReadings
            );
            this.generatorReadingsLoading = false;
          }
          this.generatorReadingsLoading = false;
          break;
      }
    },
    async setRangeTo() {
      switch (this.dataPoint) {
        case "work":
          this.workRequestsRangeTo = this.range.end;
          this.$store.commit("maintenance/workRequests/toggleRefresh");
          this.getWorkRequests(this);
          break;
        case "vendor":
          this.vendorsRangeTo = this.range.end;
          this.$store.commit("people/vendors/toggleRefresh");
          this.getVendors(this);
          break;
        case "material":
          this.materialsRangeTo = this.range.end;
          this.$store.commit("hagul/inventory/materials/toggleRefresh");
          this.getMaterials(this);
          break;
        case "purchase":
          this.purchaseOrdersRangeTo = this.range.end;
          this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
          this.getPurchaseOrders(this);
          break;
        case "sales":
          this.salesOrdersRangeTo = this.range.end;
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.getSalesOrders(this);
          break;
        case "ppm":
          this.maintenanceCyclesRangeTo = this.range.end;
          this.$store.commit("maintenance/maintenanceCycles/toggleRefresh");
          this.getMaintenanceCycles(this);
          break;
        case "technician":
          this.technicianFeedbacksRangeTo = this.range.end;
          this.$store.commit("performance/technicianFeedbacks/toggleRefresh");
          this.getTechnicianFeedbacks(this);
          break;
        case "generator":
          this.generatorReadingsLoading = true;
          if (this.generatorTank === "Justitia Tank One") {
            this.generatorReadingsLoading = true;
            const propelFmGroundTankReadings =
              await this.getPropelFmGroundTankReadings({
                associations: ["sensor"],
                page: 1,
                perPage: 10000,
                byUnitId: null,
                rangeBy: "created_at",
                rangeFrom: this.range.start,
                rangeTo: this.range.end
              });
            this.propelFmGroundTankReadings = [];
            this.propelFmGroundTankReadings = this.getGeneratorMetrics(
              propelFmGroundTankReadings
            );
            this.generatorReadingsLoading = false;
          } else if (this.generatorTank === "Metro gardens underground tank") {
            // this.generatorReadingsLoading = true;
            // const metroUnderheadTankReadings =
            //   await this.getMetroUnderheadTankReadings({
            //     associations: ["sensor"],
            //     page: 1,
            //     perPage: 10000,
            //     byUnitId: null,
            //     rangeBy: "created_at",
            //     rangeFrom: this.range.start,
            //     rangeTo: this.range.end,
            //   });
            // this.metroUnderheadTankReadings = [];
            // this.metroUnderheadTankReadings = this.getGeneratorMetrics(
            //   metroUnderheadTankReadings
            // );
            // this.generatorReadingsLoading = false;
            break;
          }
      }
    },
    getGeneratorMetrics(readings) {
      if (readings.length < 0) return;
      const tankDailyConsumption = readings.reduce((acc, reading) => {
        const dateString = new Date(reading.created_at).toDateString();
        if (!acc[dateString]) acc[dateString] = [];
        acc[dateString].push(reading.value);
        return acc;
      }, {});

      // this.tankDailyConsumption = this.dailyFuelUsage(tankDailyConsumption);
      return this.dailyFuelUsage(tankDailyConsumption);
    },
    dailyFuelUsage(fuelObject) {
      let result = {};
      const consumption = (arr) => {
        let objDiff = { diff: 0 };
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] > arr[i - 1]) {
            objDiff["diff"] += arr[i] - arr[i - 1];
          } else if (arr[i] < arr[i - 1]) {
            continue;
          }
        }
        return objDiff.diff;
      };

      for (const key in fuelObject) {
        // const fuelConsumption = consumption(fuelObject[key]);
        const fuelObjectArray = fuelObject[key];
        const fuelConsumption = Math.abs(
          fuelObjectArray[fuelObjectArray.length - 1] - fuelObjectArray[0]
        );
        result[key] = fuelConsumption;
      }
      return result;
    },
    async changeGeneratorType(event) {
      let type = event.target?.value;
      switch (type) {
        case "Propelfmgroundtank":
          this.generatorTank = "Justitia Tank One";
          break;
        case "Metrooverheadgroundtank":
          this.generatorTank = "Metro gardens underground tank";
          break;
      }
    },
    openDate() {
      this.shouldOpenDate = !this.shouldOpenDate;
      this.shouldOpenDateTo = false;
    },
    openDateTo() {
      this.shouldOpenDate = false;
      this.shouldOpenDateTo = !this.shouldOpenDateTo;
    },
    async changeUnit(event) {
      let unit = event.target?.value;
      let unitId = Number(unit.split("-")[1]);
      this.currentUnit = unit.split("-")[0].toLowerCase();
      if (unit === "all") unitId = null;
      switch (this.dataPoint) {
        case "work":
          this.workRequestsUnitId = unitId;
          await this.$store.commit("maintenance/workRequests/toggleRefresh");
          await this.getWorkRequests(this);
          break;
        case "sales":
          this.salesOrdersUnitId = unitId;
          break;
        case "ppm":
          this.maintenanceCyclesUnitId = unitId;
          break;
      }
    },
    openModal() {
      this.showModal = !this.showModal;
    },
    async changeWorkType(event) {
      let type = event.target?.value;
      if (type == "all") {
        this.workOrderType = "all";
        this.workRequestStatusCodes = null;
      } else if (type == "work-not-started") {
        this.workRequestStatusCodes = ["01", "05", "20", "35", "100", "105"];
        await this.$store.commit("maintenance/workRequests/toggleRefresh");
        await this.getWorkRequests(this);
        this.workOrderType = "work-not-started";
      } else if (type == "work-started") {
        this.workRequestStatusCodes = ["60"];
        await this.$store.commit("maintenance/workRequests/toggleRefresh");
        await this.getWorkRequests(this);
        this.workOrderType = "work-started";
      } else if (type == "work-completed") {
        this.workRequestStatusCodes = ["65", "80"];
        await this.$store.commit("maintenance/workRequests/toggleRefresh");
        await this.getWorkRequests(this);
        this.workOrderType = "work-completed";
      }
    },
    changeDataPoint(event) {
      let type = event.target?.value;
      switch (type) {
        case "work":
          this.dataPoint = "work";
          this.hasUnit = true;
          break;

        case "vendor":
          this.dataPoint = "vendor";
          this.hasUnit = false;
          break;

        case "material":
          this.dataPoint = "material";
          this.hasUnit = false;
          break;

        case "purchase":
          this.dataPoint = "purchase";
          this.hasUnit = false;
          break;
        case "sales":
          this.dataPoint = "sales";
          this.hasUnit = true;
          break;

        case "ppm":
          this.dataPoint = "ppm";
          this.hasUnit = true;
          break;

        case "technician":
          this.dataPoint = "technician";
          this.hasUnit = false;
          break;

        case "generator":
          this.dataPoint = "generator";
          this.hasUnit = false;
          break;

        default:
          break;
      }
    }
  },
  mounted() { },
  mixins: [iotMixin, timeFunctions]
};
</script>

<style scoped>
.container {
  position: relative;
}

.wrapper {
  background: rgb(19, 148, 81);
  border-radius: 60px;
  width: 61px;
  height: 61px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -webkit-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  -moz-box-shadow: -9px 10px 5px -5px rgba(95, 91, 91, 0.75);
  cursor: pointer;
}

.wrapper:hover::after {
  content: "Download Spool Report";
  width: 100px;
  min-height: 30px;
  background: rgb(233, 233, 233);
  border-radius: 10px;
  position: absolute;
  right: -10px;
  top: -45px;
  padding: 6px;
  color: inherit;
}

.wrapper:active {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}

.spool-download {
  height: 50px;
  width: 50px;
}

.modal-item {
  border-radius: 5px;
  align-items: flex-start;

  background: #fff;
  min-height: 500px;
  width: 400px;
  position: fixed;
  top: 20vh;
  left: 30%;
  padding: 20px;
  /* padding-top: 20px; */
  display: flex;
  flex-direction: column;
}

.header {
  flex: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.header>button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  /* background: rgb(255, 102, 0); */
}

/* button:focus {
  outline: none;
} */
.body {
  /* margin-top: 15px; */
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex: 5;
  height: 100%;
  width: 100%;
  /* padding: 10px; */
}

.date {
  margin-bottom: 15px;
  justify-self: center;
  align-self: center;
}

.spool-type {
  width: inherit;
  height: 40px;
  margin-bottom: 20px;
  font-size: 15px;
  color: inherit;
}

.spool-type:focus {
  outline: none;
}

.footer {
  width: inherit;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  user-select: none;
  cursor: pointer;
  background: green;
  height: 45px;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
  -webkit-box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
  -moz-box-shadow: 9px 8px 9px -11px rgba(0, 0, 0, 0.56);
}

.button:hover {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}

.button:active {
  box-shadow: 0px 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px 0px;
  -moz-box-shadow: 0px 0px 0px 0px;
}
</style>
