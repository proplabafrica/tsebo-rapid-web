<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <div
      class="wrapper"
      v-if="
        qfaOverheadReadings.length
        // qfaOverheadReadingsTwo.length &&
        // qfaAdmiraltyReadings.length &&
        // qfaHeadOfficeReadings.length
        // qfaYabaTankOneCapacity.length &&
        // qfaYabaTankTwoCapacity.length
      "
    >
      <!-- <div
      class="wrapper"
      v-if="!qfaOverheadReadingsLoading && !qfaOverheadReadingsTwoLoading"
    > -->
      <div
        v-if="
          (qfaOverheadReadings.length && qfaOverheadReadings[0].value < 1500) ||
          (qfaOverheadReadingsTwo.length && qfaOverheadReadingsTwo[0].value < 1500) ||
          (qfaAdmiraltyReadings.length && qfaAdmiraltyReadings[0].value < 1000) ||
          (qfaHeadOfficeReadings.length && qfaHeadOfficeReadings[0].value < 500) ||
          (qfaYabaTankOneCapacity.length && qfaYabaTankOneCapacity[0].value < 500) ||
          (qfaYabaTankTwoCapacity.length && qfaYabaTankTwoCapacity[0].value < 500)
        "
        class="toast-holder"
      >
        <div
          class="toast showed tx-white bg-danger"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <span class="mr-3 tx-20">
              <i class="icon ion-ios-information-outline"></i>
            </span>
            <strong
              class="mr-auto"
              v-text="`Diesel tank is currently Low!`"
            ></strong>
            <span
              class="ml-3 mb-1 tx-20 cursor-pointer btn-close"
              aria-hidden="false"
              data-bs-dismiss="toast"
              aria-label="Close"
              @click="openAlert(index)"
              >&times;</span
            >
            <div class="progress"></div>
          </div>
        </div>
      </div>
      <select class="tanks_dropdown" v-on:change="changeTank($event)">
        <option value="tank1">{{ "BAC tank 1" }}</option>
        <option value="tank2">
          {{ "BAC tank 2" }}
        </option>
        <option value="tank3">
          {{ "Lekki centro mall" }}
        </option>
        <option value="tank4">
          {{ "Head office tank" }}
        </option>
        <option value="tank5">
          {{ "Yaba tank one" }}
        </option>
        <option value="tank6">
          {{ "Yaba tank two" }}
        </option>
      </select>
      <div>
        <date-picker
          @update="$emit('update')"
          class="calender"
          :class="{ show: showCalendar }"
          v-model="range"
          is-range
          @input="setFilterPeriod"
        />
        <p class="mg-b-0">
          <i
            class="icon ion-calendar mg-r-3"
            style="cursor: pointer"
            @click="showCalendar = !showCalendar"
          ></i>
          <i
            class="ionicons ion-refresh tx-teal icon"
            style="cursor: pointer"
            @click="clearRange"
          ></i>
        </p>
      </div>
      <div class="row xs">
        <div class="col-lg-12">
          <div class="row row-xs">
            <div class="col-12 col-lg-8 mg-b-10">
              <!-- <div class="row row-xs">
                </div> -->
              <div class="row">
                <div class="col-12 col-md mg-b-10 mg-md-b-0">
                  <div class="card card-status card-height shadow-sm">
                    <div class="media">
                      <div class="icon-container" id="level-now">
                        <i
                          class="icon ion-arrow-graph-up-right"
                          :style="{
                            fontSize: '50px !important',
                            color: '#f7f7d5'
                          }"
                        ></i>
                      </div>

                      <div class="mg-l-10">
                        <h1
                          v-if="tank === 'tank1' && qfaOverheadReadings.length"
                        >
                          {{
                            (
                              qfaOverheadReadings[0].value / tankCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1
                          v-else-if="
                            tank === 'tank2' && qfaOverheadReadingsTwo.length
                          "
                        >
                          {{
                            (
                              qfaOverheadReadingsTwo[0].value / tankCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1
                          v-else-if="
                            tank === 'tank3' && qfaAdmiraltyReadings.length
                          "
                        >
                          {{
                            (
                              qfaAdmiraltyReadings[0].value / tankCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1
                          v-else-if="
                            tank === 'tank4' && qfaHeadOfficeReadings.length
                          "
                        >
                          {{
                            (
                              qfaHeadOfficeReadings[0].value /
                              qfaHeadOfficeCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1
                          v-else-if="
                            tank === 'tank5' && qfaYabaTankOneReadings.length
                          "
                        >
                          {{
                            (
                              qfaYabaTankOneReadings[0].value /
                              qfaYabaTankOneCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1
                          v-else-if="
                            tank === 'tank6' && qfaYabaTankTwoReadings.length
                          "
                        >
                          {{
                            (
                              qfaYabaTankTwoReadings[0].value /
                              qfaYabaTankTwoCapacity
                            ).toFixed(1) * 100
                          }}%
                        </h1>
                        <h1 v-else>0.00%</h1>
                        <p>Fuel Level</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md mg-b-10 mg-md-b-0">
                  <div class="card card-status card-height shadow-sm">
                    <div class="media">
                      <div class="icon-container" id="to-fill">
                        <i
                          class="icon ion-soup-can"
                          :style="{ fontSize: '50px !important' }"
                        ></i>
                      </div>

                      <div class="mg-l-10">
                        <h1>
                          {{
                            typeof daily_fuel_usage === "number"
                              ? daily_fuel_usage.toFixed(2)
                              : 0
                          }}
                          ltrs
                        </h1>
                        <p>Daily Usage</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md mg-b-10 mg-md-b-0">
                  <div class="card card-status card-height shadow-sm">
                    <div class="media">
                      <div class="icon-container" id="tank-capacity">
                        <i
                          class="icon ion-soup-can"
                          :style="{ fontSize: '50px !important' }"
                        ></i>
                      </div>

                      <div class="mg-l-10">
                        <h1>
                          {{
                            tank === "tank1"
                              ? qfaOverheadCapacity
                              : tank === "tank2"
                              ? qfaOverheadCapacityTwo
                              : tank === "tank3"
                              ? qfaAdmiraltyCapacity
                              : tank === "tank4"
                              ? qfaHeadOfficeCapacity
                              : tank === "tank5"
                              ? qfaYabaTankOneCapacity
                              : tank === "tank6"
                              ? qfaYabaTankTwoCapacity
                              : 0
                          }}
                          ltrs
                        </h1>
                        <p>Tank Capacity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-12 col-lg"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginTop: '20px',
                  position: 'relative'
                }"
              >
                <!-- Tank -->
                <div
                  v-if="tank === 'tank1' && qfaOverheadReadings.length > 0"
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaOverheadReadings[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaOverheadReadings.length > 0
                        ? qfaOverheadReadings[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaOverheadReadings.length &&
                      (qfaOverheadReadings[0].value / tankCapacity).toFixed(1) *
                        100 >
                        30
                        ? "Medium"
                        : qfaOverheadReadings.length &&
                          (qfaOverheadReadings[0].value / tankCapacity).toFixed(
                            1
                          ) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tank === 'tank2' && qfaOverheadReadingsTwo.length > 0
                  "
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaOverheadReadingsTwo[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaOverheadReadingsTwo.length > 0
                        ? qfaOverheadReadingsTwo[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaOverheadReadingsTwo.length &&
                      (qfaOverheadReadingsTwo[0].value / tankCapacity).toFixed(
                        1
                      ) *
                        100 >
                        30
                        ? "Medium"
                        : qfaOverheadReadingsTwo.length &&
                          (
                            qfaOverheadReadingsTwo[0].value / tankCapacity
                          ).toFixed(1) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tank === 'tank3' && qfaAdmiraltyReadings.length > 0
                  "
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaAdmiraltyReadings[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaAdmiraltyReadings.length > 0
                        ? qfaAdmiraltyReadings[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaAdmiraltyReadings.length &&
                      (qfaAdmiraltyReadings[0].value / tankCapacity).toFixed(
                        1
                      ) *
                        100 >
                        30
                        ? "Medium"
                        : qfaAdmiraltyReadings.length &&
                          (
                            qfaAdmiraltyReadings[0].value / tankCapacity
                          ).toFixed(1) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tank === 'tank4' && qfaHeadOfficeReadings.length > 0
                  "
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaHeadOfficeReadings[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaHeadOfficeReadings.length > 0
                        ? qfaHeadOfficeReadings[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaHeadOfficeReadings.length &&
                      (qfaHeadOfficeReadings[0].value / tankCapacity).toFixed(
                        1
                      ) *
                        100 >
                        30
                        ? "Medium"
                        : qfaHeadOfficeReadings.length &&
                          (
                            qfaHeadOfficeReadings[0].value / tankCapacity
                          ).toFixed(1) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tank === 'tank5' && qfaYabaTankOneReadings.length > 0
                  "
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaYabaTankOneReadings[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaYabaTankOneReadings.length > 0
                        ? qfaYabaTankOneReadings[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaYabaTankOneReadings.length &&
                      (qfaYabaTankOneReadings[0].value / tankCapacity).toFixed(
                        1
                      ) *
                        100 >
                        30
                        ? "Medium"
                        : qfaYabaTankOneReadings.length &&
                          (
                            qfaYabaTankOneReadings[0].value / tankCapacity
                          ).toFixed(1) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tank === 'tank6' && qfaYabaTankTwoReadings.length > 0
                  "
                  class="tank"
                >
                  <tank
                    :tankLevel="qfaYabaTankTwoReadings[0].value"
                    :tankSize="tankCapacity"
                  />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value:
                    {{
                      qfaYabaTankTwoReadings.length > 0
                        ? qfaYabaTankTwoReadings[0].value
                        : 0
                    }}
                    (ltrs)
                    <br />
                    Type:
                    {{
                      qfaYabaTankTwoReadings.length &&
                      (qfaYabaTankTwoReadings[0].value / tankCapacity).toFixed(
                        1
                      ) *
                        100 >
                        30
                        ? "Medium"
                        : qfaYabaTankTwoReadings.length &&
                          (
                            qfaYabaTankTwoReadings[0].value / tankCapacity
                          ).toFixed(1) *
                            100 >
                            70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
                <div v-else class="tank">
                  <tank :tankLevel="0" :tankSize="tankCapacity" />
                  <div class="tank_details">
                    Name: Fuel Level <br />
                    Value: 0 (ltrs)
                    <br />
                    Type:
                    {{
                      (0 / tankCapacity).toFixed(1) * 100 > 30
                        ? "Medium"
                        : (0 / tankCapacity).toFixed(1) * 100 > 70
                        ? "High"
                        : "Low"
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <!-- Location -->
              <div
                class="card bg-light pd-20 map-cont"
                :style="{
                  display: 'flex',
                  minHeight: '300px !important',
                  height: '500px !important',
                  flexDirection: 'column'
                }"
              >
                <h6>Location</h6>

                <div id="map"></div>
                <span id="marker"></span>
              </div>
            </div>
          </div>

          <!-- Graph -->
          <div class="row row-xs mg-t-20">
            <div class="col-12 col-lg-8">
              <div class="row">
                <div class="col-12 col-lg mg-b-10">
                  <div
                    class="card pd-20"
                    :style="{
                      backgroundColor: '#fff',
                      height: '400px !important'
                    }"
                  >
                    <h6>FUEL LEVEL</h6>

                    <div>
                      <VueApexCharts
                        v-if="
                          tank === 'tank1' &&
                          fuelLevelReading1[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel"
                        :series="fuelLevelReading1"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank === 'tank2' &&
                          fuelLevelReading2[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel2"
                        :series="fuelLevelReading2"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank === 'tank3' &&
                          fuelLevelReading3[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel3"
                        :series="fuelLevelReading3"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank === 'tank4' &&
                          fuelLevelReading4[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel4"
                        :series="fuelLevelReading4"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank === 'tank5' &&
                          fuelLevelReading5[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel4"
                        :series="fuelLevelReading5"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank === 'tank6' &&
                          fuelLevelReading6[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="fuel_level_chart"
                        :options="chartOptionsFuelLevel4"
                        :series="fuelLevelReading6"
                        width="500"
                      ></VueApexCharts>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-lg mg-b-10">
                  <div
                    class="card pd-20"
                    :style="{
                      backgroundColor: '#fff',
                      height: '400px !important'
                    }"
                  >
                    <h6>TO FILL</h6>
                    <div>
                      <VueApexCharts
                        v-if="
                          tank == 'tank1' && toFillReading1[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill"
                        :series="toFillReading1"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank == 'tank2' && toFillReading2[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill2"
                        :series="toFillReading2"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank == 'tank3' && toFillReading3[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill2"
                        :series="toFillReading3"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank == 'tank4' && toFillReading4[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill4"
                        :series="toFillReading4"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank == 'tank5' && toFillReading5[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill4"
                        :series="toFillReading5"
                        width="500"
                      ></VueApexCharts>
                      <VueApexCharts
                        v-else-if="
                          tank == 'tank6' && toFillReading6[0].data.length > 0
                        "
                        type="area"
                        height="350"
                        ref="to_fill_chart"
                        :options="chartOptionsToFill4"
                        :series="toFillReading6"
                        width="500"
                      ></VueApexCharts>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card-body p-0 work-request-grouping">
                <div class="row mg-x-0">
                  <div
                    class="col-12 col-md pd-0"
                    :style="{
                      minHeight: '500px !important',
                      backgroundColor: '#fff'
                    }"
                  >
                    <div
                      class="card bg-light pd-20"
                      :style="{
                        minHeight: '500px !important'
                      }"
                    >
                      <h6>Activity</h6>
                      <div
                        :style="{
                          height: '100%',
                          overflow: 'scroll',

                          width: '100% !important'
                        }"
                      >
                        <ul
                          class="list-group"
                          :style="{
                            color: '#fff'
                          }"
                          v-for="dt in qfaFuel"
                          :key="dt.id"
                        >
                          <li
                            class="list-group-item"
                            :style="{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor:
                                ((dt.value / tankCapacity) * 100).toFixed(1) <
                                40
                                  ? '#eb432db7'
                                  : '#20fa20b7'
                            }"
                          >
                            <span>Fuel Level </span>
                            <span
                              >{{
                                ((dt.value / tankCapacity) * 100).toFixed(1)
                              }}%</span
                            >
                            <span v-if="new Date(dt.created_at).getHours() < 10"
                              >{{ new Date(dt.created_at).getDate() }}-{{
                                new Date(dt.created_at).getMonth() + 1
                              }}-{{ new Date(dt.created_at).getFullYear() }} |
                              0{{ new Date(dt.created_at).getHours() }}:{{
                                new Date(dt.created_at).getMinutes()
                              }}</span
                            >
                            <span v-else
                              >{{ new Date(dt.created_at).getDate() }}-{{
                                new Date(dt.created_at).getMonth() + 1
                              }}-{{ new Date(dt.created_at).getFullYear() }}
                              |
                              {{ new Date(dt.created_at).getHours() }}:{{
                                new Date(dt.created_at).getMinutes()
                              }}</span
                            >
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="next_n_prev">
                      <button class="prev" @click="goToPrevious()">Prev</button>
                      <span class="current_page"
                        >{{ page }} of {{ totalPages }}</span
                      >
                      <button
                        class="next"
                        style="border: none"
                        @click="goToNext()"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading v-else />
  </div>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
import chart from "@/components/ui/chart";
import authMixin from "@/mixins/auth";
import tank from "@/components/iot/dashboard/power-systems/tank";
import { Loader } from "@googlemaps/js-api-loader";
import loading from "@/components/ui/loading";
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import iotMixin from "@/mixins/iot/readings";

export default {
  components: {
    chart,
    tank,
    loading,
    Calendar,
    DatePicker,
    VueApexCharts: () => import("vue-apexcharts")
  },

  data() {
    return {
      filterDate: false,
      monthRange: null,
      range: {
        start: null,
        end: null
      },
      showCalendar: false,
      qfaOverheadReadings: [],
      qfaOverheadReadingsRangeBy: null,
      qfaOverheadReadingsRangeFrom: null,
      qfaOverheadReadingsRangeTo: null,
      qfaOverheadReadingsLoading: false,
      qfaOverheadReadingsTwo: [],
      qfaOverheadReadingsTwoRangeBy: null,
      qfaOverheadReadingsTwoRangeFrom: null,
      qfaOverheadReadingsTwoRangeTo: null,
      qfaOverheadReadingsTwoLoading: false,
      qfaAdmiraltyReadings: [],
      qfaAdmiraltyReadingsRangeBy: null,
      qfaAdmiraltyReadingsRangeFrom: null,
      qfaAdmiraltyReadingsRangeTo: null,
      qfaAdmiraltyReadingsLoading: false,
      qfaHeadOfficeReadings: [],
      qfaHeadOfficeReadingsRangeBy: null,
      qfaHeadOfficeReadingsRangeFrom: null,
      qfaHeadOfficeReadingsRangeTo: null,
      qfaHeadOfficeReadingsLoading: false,
      qfaYabaTankOneReadings: [],
      qfaYabaTankOneReadingsRangeBy: null,
      qfaYabaTankOneReadingsRangeFrom: null,
      qfaYabaTankOneReadingsRangeTo: null,
      qfaYabaTankOneReadingsLoading: false,
      qfaYabaTankTwoReadings: [],
      qfaYabaTankTwoReadingsRangeBy: null,
      qfaYabaTankTwoReadingsRangeFrom: null,
      qfaYabaTankTwoReadingsRangeTo: null,
      qfaYabaTankTwoReadingsLoading: false,
      daily_fuel_usage: null,
      qfaOverheadCapacity: 5000,
      qfaOverheadCapacityTwo: 5000,
      qfaAdmiraltyCapacity: 3000,
      qfaHeadOfficeCapacity: 2000,
      qfaYabaTankOneCapacity: 2000,
      qfaYabaTankTwoCapacity: 2000,
      tankCapacity: 5000,
      dailyUsage: null,
      qfaFuel: [],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      tank_1_name: "",
      tank_2_name: "",
      device_eui1: "244E7B000000405E",
      device_eui2: "244E7B0000003BDF",
      config: {
        headers: {
          "X-Access-Token": "ujjVGZN2k76lCz2B5nrGeQF3jjRUQhUJ"
        }
      },
      page: 1,
      totalPages: 1,
      noOfTanks: 1,
      tankDetails: null,
      details1: null,
      details2: null,
      data: [],
      data2: [],
      temperatureData: [],
      toFillData: [],
      fuelLevelData: [],
      fuelLevelReading1: [
        {
          data: []
        }
      ],
      fuelLevelReading2: [
        {
          data: []
        }
      ],
      fuelLevelReading3: [
        {
          data: []
        }
      ],
      fuelLevelReading4: [
        {
          data: []
        }
      ],
      fuelLevelReading5: [
        {
          data: []
        }
      ],
      fuelLevelReading6: [
        {
          data: []
        }
      ],
      toFillReading1: [
        {
          data: []
        }
      ],
      toFillReading2: [
        {
          data: []
        }
      ],
      toFillReading3: [
        {
          data: []
        }
      ],
      toFillReading4: [
        {
          data: []
        }
      ],
      toFillReading5: [
        {
          data: []
        }
      ],
      toFillReading6: [
        {
          data: []
        }
      ],
      temperatureData2: [],
      toFillData2: [],
      fuelLevelData2: [],
      fuelLevelData3: [],
      dates: [],
      graphData: [],
      blue: "blue",
      tankData: [],
      name: ["Temperature", "To Fill", "Fuel Level Now"],
      temperature: [],
      to_fill: [],
      fuel_level: [],
      daily_usage: 0,
      value: null,
      tank: "tank1",
      seriesTemperature: [
        {
          data: []
        }
      ],
      seriesToFill: [
        {
          data: []
        }
      ],
      seriesFuelLevel: [
        {
          data: []
        }
      ],
      fuelLevelSeries1: [
        {
          data: []
        }
      ],
      toFillSeries1: [
        {
          data: []
        }
      ],
      toFillSeries2: [
        {
          data: []
        }
      ],
      fuelLevelSeries2: [
        {
          data: []
        }
      ],
      seriesTemperature2: [
        {
          data: []
        }
      ],
      seriesToFill2: [
        {
          data: []
        }
      ],
      seriesFuelLevel2: [
        {
          data: []
        }
      ],
      chartOptionsTemperature: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_year"
      },
      chartOptionsToFill: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_year"
      },
      chartOptionsToFill2: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_year"
      },
      chartOptionsToFill3: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_year"
      },
      chartOptionsToFill4: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_year"
      },
      chartOptionsFuelLevel: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_month"
      },
      chartOptionsFuelLevel2: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_month"
      },
      chartOptionsFuelLevel3: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_month"
      },
      chartOptionsFuelLevel4: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        annotations: {
          yAxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                show: true,
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396"
                }
              }
            }
          ],
          xaxis: [
            {
              x: new Date("01 Feb 2022").getTime(),
              borderColor: "#999",
              yAxisIndex: 0,
              label: {
                show: true,
                text: "Rally",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Feb 2022").getTime(),
          tickAmount: 6
        },
        yaxis: {
          max: 100,
          min: 0
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },

        selection: "one_month"
      }
    };
  },
  created() {
    this.getIotData();
  },
  methods: {
    ...mapActions({
      getQfaOverheadReadings: "iot/qfaOverheadReadings/getQfaOverheadReadings",
      getQfaOverheadReadingsTwo:
        "iot/qfaOverheadReadingsTwo/getQfaOverheadReadingsTwo",
      getQfaAdmiraltyReadings:
        "iot/qfaAdmiraltyReadings/getQfaAdmiraltyReadings",
      getQfaHeadOfficeReadings:
        "iot/qfaHeadOfficeReadings/getQfaHeadOfficeReadings",
      getQfaYabaTankOneReadings:
        "iot/qfaYabaTankOneReadings/getQfaYabaTankOneReadings",
      getQfaYabaTankTwoReadings:
        "iot/qfaYabaTankTwoReadings/getQfaYabaTankTwoReadings"
    }),
    openClass(alertClass) {
      if (!alertClass) return null;
      alertClass.classList.remove("showed");
      alertClass.classList.add("disappear");
    },
    openAlert(index) {
      const alertClass = document.querySelectorAll(".toast");
      this.openClass(alertClass[0]);
    },
    showToast() {
      const toast = document.querySelectorAll(".toast");
      const progress = document.querySelectorAll(".progress");

      for (let i = 0; i < toast.length; i++) {
        toast[i].classList.add("showed");
      }

      for (let i = 0; i < progress.length; i++) {
        progress[i].classList.add("active");
      }

      setTimeout(() => {
        for (let i = 0; i < toast.length; i++) {
          toast[i].classList.remove("showed");
          toast[i].classList.add("adjust");
        }
      }, 5500);
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss")
      };
    },
    async clearRange() {
      this.range = null;
      this.filterDate = false;

      this.qfaOverheadReadingsRangeBy = null;
      this.qfaOverheadReadingsRangeFrom = null;
      this.qfaOverheadReadingsRangeTo = null;

      this.qfaOverheadReadingsRangeBy = null;
      this.qfaOverheadReadingsRangeFrom = null;
      this.qfaOverheadReadingsRangeTo = null;

      this.qfaAdmiraltyReadingsRangeBy = null;
      this.qfaAdmiraltyReadingsRangeFrom = null;
      this.qfaAdmiraltyReadingsRangeTo = null;

      this.qfaHeadOfficeReadingsRangeBy = null;
      this.qfaHeadOfficeReadingsRangeFrom = null;
      this.qfaHeadOfficeReadingsRangeTo = null;

      this.qfaYabaTankOneReadingsRangeBy = null;
      this.qfaYabaTankOneReadingsRangeFrom = null;
      this.qfaYabaTankOneReadingsRangeTo = null;

      this.qfaYabaTankTwoReadingsRangeBy = null;
      this.qfaYabaTankTwoReadingsRangeFrom = null;
      this.qfaYabaTankTwoReadingsRangeTo = null;

      this.$store.commit("iot/qfaOverheadReadings/toggleRefresh");
      this.$store.commit("iot/qfaOverheadReadingsTwo/toggleRefresh");
      this.$store.commit("iot/qfaAdmiraltyReadings/toggleRefresh");
      this.$store.commit("iot/qfaHeadOfficeReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankOneReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankTwoReadings/toggleRefresh");

      await this.getQfaOverheadReadings(this);
      await this.getQfaOverheadReadingsTwo(this);
      await this.getQfaAdmiraltyReadings(this);
      await this.getQfaHeadOfficeReadings(this);
      await this.getQfaYabaTankOneReadings(this);
      await this.getQfaYabaTankTwoReadings(this);
      this.getUsage();
    },
    async setFilterPeriod() {
      this.filterDate = true;
      var currentDate = new Date();
      const { name } = await this.monthStartAndEnd(currentDate);
      this.monthRange = this.range
        ? `${this.range.start.toString().substring(4, 15)} - ${this.range.end
            .toString()
            .substring(4, 15)}`
        : name;

      this.qfaOverheadReadingsRangeBy = "created_at";
      this.qfaOverheadReadingsRangeFrom = this.range ? this.range.start : null;
      this.qfaOverheadReadingsRangeTo = this.range ? this.range.end : null;

      this.qfaOverheadReadingsTwoRangeBy = "created_at";
      this.qfaOverheadReadingsTwoRangeFrom = this.range
        ? this.range.start
        : null;
      this.qfaOverheadReadingsTwoRangeTo = this.range ? this.range.end : null;

      this.qfaAdmiraltyReadingsRangeBy = "created_at";
      this.qfaAdmiraltyReadingsRangeFrom = this.range ? this.range.start : null;
      this.qfaAdmiraltyReadingsRangeTo = this.range ? this.range.end : null;

      this.qfaHeadOfficeReadingsRangeBy = "created_at";
      this.qfaHeadOfficeReadingsRangeFrom = this.range
        ? this.range.start
        : null;
      this.qfaHeadOfficeReadingsRangeTo = this.range ? this.range.end : null;

      this.qfaYabaTankOneRangeBy = "created_at";
      this.qfaYabaTankOneRangeFrom = this.range ? this.range.start : null;
      this.qfaYabaTankOneRangeTo = this.range ? this.range.end : null;

      this.qfaYabaTankTwoRangeBy = "created_at";
      this.qfaYabaTankTwoRangeFrom = this.range ? this.range.start : null;
      this.qfaYabaTankTwoRangeTo = this.range ? this.range.end : null;

      this.$store.commit("iot/qfaOverheadReadings/toggleRefresh");
      this.$store.commit("iot/qfaOverheadReadingsTwo/toggleRefresh");
      this.$store.commit("iot/qfaAdmiraltyReadings/toggleRefresh");
      this.$store.commit("iot/qfaHeadOfficeReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankOneReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankTwoReadings/toggleRefresh");

      await this.getQfaOverheadReadings(this);
      await this.getQfaOverheadReadingsTwo(this);
      await this.getQfaAdmiraltyReadings(this);
      await this.getQfaHeadOfficeReadings(this);
      await this.getQfaYabaTankOneReadings(this);
      await this.getQfaYabaTankTwoReadings(this);
      this.getUsage();

      this.$refs.chart
        ? this.$refs.fuel_level_chart.updateSeries(this.fuelLevelReading1, true)
        : "";
      this.$refs.chart
        ? this.$refs.fuel_level_chart.updateSeries(this.fuelLevelReading2, true)
        : "";
      this.$refs.chart
        ? this.$refs.to_fill_chart.updateSeries(this.toFillReading1, true)
        : "";
      this.$refs.chart
        ? this.$refs.to_fill_chart.updateSeries(this.toFillReading2, true)
        : "";
      // this.filterDate = false;
    },
    getDailyUsage(fuelReadings) {
      let used;
      let todayData = [];
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.toDateString();

      for (const i in fuelReadings) {
        if (
          new Date(fuelReadings[i].created_at).toDateString() ==
          date.toString().substring(0, 15)
        ) {
          todayData.push(fuelReadings[i]);
        } else {
          break;
        }
      }
      used =
        todayData.length > 0
          ? todayData[0].value - todayData[todayData.length - 1].value
          : 0;
      return used;
    },
    getCummulativeUsage(fuelReadings) {
      let cummulativeUsage = 0;
      let todayData = [];
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.toDateString();
      let value = 0;

      const readings = this.groupReadings(fuelReadings);
      let uniqueArr = readings.reduce((acc, current) => {
        if (!acc.find((item) => item.month === current.month)) {
          acc.push(current);
        }
        return acc;
      }, []);
      for (const j in uniqueArr) {
        for (const i in fuelReadings) {
          date = new Date(uniqueArr[j].created_at);
          if (
            new Date(fuelReadings[i].created_at).toDateString() ==
            date.toString().substring(0, 15)
          ) {
            todayData.push(fuelReadings[i]);
          } else {
          }
        }
        value = Math.abs(
          todayData[0].value - todayData[todayData.length - 1].value
        );

        todayData = [];
        cummulativeUsage = cummulativeUsage + value;
      }
      return cummulativeUsage;
    },
    getUsage() {
      let used;
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.toDateString();
      if (this.tank === "tank1") {
        if (this.qfaOverheadReadings.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaOverheadReadings);
        } else {
          used = this.getCummulativeUsage(this.qfaOverheadReadings);
        }
      } else if (this.tank === "tank2") {
        if (this.qfaOverheadReadingsTwo.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaOverheadReadingsTwo);
        } else {
          used = this.getCummulativeUsage(this.qfaOverheadReadingsTwo);
        }
      } else if (this.tank === "tank3") {
        if (this.qfaAdmiraltyReadings.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaAdmiraltyReadings);
        } else {
          used = this.getCummulativeUsage(this.qfaAdmiraltyReadings);
        }
      } else if (this.tank === "tank4") {
        if (this.qfaHeadOfficeReadings.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaHeadOfficeReadings);
        } else {
          used = this.getCummulativeUsage(this.qfaHeadOfficeReadings);
        }
      } else if (this.tank === "tank5") {
        if (this.qfaHeadOfficeReadings.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaHeadOfficeReadings);
        } else {
          used = this.getCummulativeUsage(this.qfaHeadOfficeReadings);
        }
      } else if (this.tank === "tank6") {
        if (this.qfaHeadOfficeReadings.length <= 0) return 0;
        if (!this.filterDate) {
          used = this.getDailyUsage(this.qfaHeadOfficeReadings);
        } else {
          used = this.getCummulativeUsage(this.qfaHeadOfficeReadings);
        }
      }
      this.filterDate = false;
      this.daily_fuel_usage = Math.abs(used);
    },
    async sendAlert(tank) {
      let tank_capacity = tank[tank.length - 1].info.capacity;
      let fuel_level = tank[tank.length - 1].read.fuel_level;

      let name = tank[0].info.name;
      if (name.toLowerCase().includes("tank1")) {
        name = "Metro Gardens Day Tank";
      } else {
        name = "Metro Gardens Underground";
      }
      if ((fuel_level / tank_capacity).toFixed(1) * 100 < 30) {
        try {
          const response = await this.$axios.post("/iot", {
            name
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        return;
      }
    },
    setQfaChartData() {
      let today;
      if (this.qfaOverheadReadings) {
        today = new Date(this.qfaOverheadReadings[0].created_at);
      } else {
        today = new Date();
      }

      let todayString = today.toDateString();
      let themonth = today.getMonth();

      let month = todayString.split(" ")[1].toString();
      let day = todayString.split(" ")[2].toString();
      let year = todayString.split(" ")[3].toString();

      day = parseInt(day - 1);

      if (day > 1) {
        today = `${day} ${month} ${year}`;
      } else {
        month = this.months[themonth - 1];
        day = 30 + day;

        today = `${day} ${month} ${year}`;
      }

      var date = new Date();
      var currentMin = new Date();
      var newMin = new Date(currentMin.getTime() - 7 * 24 * 60 * 60 * 1000);

      this.chartOptionsFuelLevel.annotations.xaxis[0].label.text = "Fuel Level";
      this.chartOptionsFuelLevel.xaxis.min = Date.parse(newMin);
      this.chartOptionsFuelLevel.xaxis.max = date;
      this.chartOptionsFuelLevel.yaxis.min = 0;
      this.chartOptionsFuelLevel.yaxis.max = this.tankCapacity;

      this.chartOptionsFuelLevel2.annotations.xaxis[0].label.text =
        "Fuel Level";
      this.chartOptionsFuelLevel2.xaxis.min = Date.parse(newMin);
      this.chartOptionsFuelLevel2.xaxis.max = date;
      this.chartOptionsFuelLevel2.yaxis.min = 0;
      this.chartOptionsFuelLevel2.yaxis.max = this.tankCapacity;

      this.chartOptionsFuelLevel3.annotations.xaxis[0].label.text =
        "Fuel Level";
      this.chartOptionsFuelLevel3.xaxis.min = Date.parse(newMin);
      this.chartOptionsFuelLevel3.xaxis.max = date;
      this.chartOptionsFuelLevel3.yaxis.min = 0;
      this.chartOptionsFuelLevel3.yaxis.max = this.qfaAdmiraltyCapacity;

      this.chartOptionsFuelLevel4.annotations.xaxis[0].label.text =
        "Fuel Level";
      this.chartOptionsFuelLevel4.xaxis.min = Date.parse(newMin);
      this.chartOptionsFuelLevel4.xaxis.max = date;
      this.chartOptionsFuelLevel4.yaxis.min = 0;
      this.chartOptionsFuelLevel4.yaxis.max = this.qfaHeadOfficeCapacity;

      // this.chartOptionsFuelLevel5.annotations.xaxis[0].label.text =
      //   "Fuel Level";
      // this.chartOptionsFuelLevel5.xaxis.min = Date.parse(newMin);
      // this.chartOptionsFuelLevel5.xaxis.max = date;
      // this.chartOptionsFuelLevel5.yaxis.min = 0;
      // this.chartOptionsFuelLevel5.yaxis.max = this.qfaYabaTankOneCapacity;

      // this.chartOptionsFuelLevel6.annotations.xaxis[0].label.text =
      //   "Fuel Level";
      // this.chartOptionsFuelLevel6.xaxis.min = Date.parse(newMin);
      // this.chartOptionsFuelLevel6.xaxis.max = date;
      // this.chartOptionsFuelLevel6.yaxis.min = 0;
      // this.chartOptionsFuelLevel6.yaxis.max = this.qfaYabaTankTwoCapacity;

      this.chartOptionsToFill.annotations.xaxis[0].label.text = "To Fill";
      this.chartOptionsToFill.annotations.xaxis[0].x = Date.parse(today);
      this.chartOptionsToFill.xaxis.min = Date.parse(newMin);
      this.chartOptionsToFill.xaxis.max = date;
      this.chartOptionsToFill.yaxis.min = 0;
      this.chartOptionsToFill.yaxis.max = this.tankCapacity;

      this.chartOptionsToFill2.annotations.xaxis[0].label.text = "To Fill";
      this.chartOptionsToFill2.annotations.xaxis[0].x = Date.parse(today);
      this.chartOptionsToFill2.xaxis.min = Date.parse(newMin);
      this.chartOptionsToFill2.xaxis.max = date;
      this.chartOptionsToFill2.yaxis.min = 0;
      this.chartOptionsToFill2.yaxis.max = this.tankCapacity;

      this.chartOptionsToFill3.annotations.xaxis[0].label.text = "To Fill";
      this.chartOptionsToFill3.xaxis.min = Date.parse(newMin);
      this.chartOptionsToFill3.xaxis.max = date;
      this.chartOptionsToFill3.yaxis.min = 0;
      this.chartOptionsToFill3.yaxis.max = this.qfaAdmiraltyCapacity;

      this.chartOptionsToFill4.annotations.xaxis[0].label.text = "To Fill";
      this.chartOptionsToFill4.xaxis.min = Date.parse(newMin);
      this.chartOptionsToFill4.xaxis.max = date;
      this.chartOptionsToFill4.yaxis.min = 0;
      this.chartOptionsToFill4.yaxis.max = this.qfaHeadOfficeCapacity;

      // this.chartOptionsToFill5.annotations.xaxis[0].label.text = "To Fill";
      // this.chartOptionsToFill5.xaxis.min = Date.parse(newMin);
      // this.chartOptionsToFill5.xaxis.max = date;
      // this.chartOptionsToFill5.yaxis.min = 0;
      // this.chartOptionsToFill5.yaxis.max = this.qfaYabaTankOneCapacity;

      // this.chartOptionsToFill6.annotations.xaxis[0].label.text = "To Fill";
      // this.chartOptionsToFill6.xaxis.min = Date.parse(newMin);
      // this.chartOptionsToFill6.xaxis.max = date;
      // this.chartOptionsToFill6.yaxis.min = 0;
      // this.chartOptionsToFill6.yaxis.max = this.qfaYabaTankTwoCapacity;
    },
    loadMap() {
      const loader = new Loader({
        apiKey: "AIzaSyABZHND2SmLuB8XILEoF2b3L7Y3Vu4bHr4",
        region: "NG",
        libraries: ["drawing", "geometry", "places"]
      });
      let mapOptions;

      mapOptions = {
        center: {},
        zoom: 18.5
      };
      loader
        .load()
        .then((google) => {
          new google.maps.Map(document.getElementById("map"), mapOptions);
        })
        .catch((e) => {
          console.log(e, "MAP ERROR");
        });
    },
    async changeTank(event) {
      let tank = event.target?.value;
      this.tank = tank;
      this.getTankParams();
      this.setQfaChartData();
      if (tank == "tank1") {
        this.tankCapacity = this.qfaOverheadCapacity;
        this.tankData = this.data;
        this.tankDetails = this.details1;
        this.qfaFuel = this.qfaOverheadReadings;
      }
      if (tank == "tank2") {
        this.tankCapacity = this.qfaOverheadCapacity;
        this.qfaFuel = this.qfaOverheadReadingsTwo.slice(0);
      }
      if (tank == "tank3") {
        this.tankCapacity = this.qfaAdmiraltyCapacity;
        this.qfaFuel = this.qfaAdmiraltyReadings.slice(0);
      }
      if (tank == "tank4") {
        this.tankCapacity = this.qfaHeadOfficeCapacity;
        this.qfaFuel = this.qfaHeadOfficeReadings.slice(0);
      }
      if (tank == "tank5") {
        this.tankCapacity = this.qfaYabaTankOneCapacity;
        this.qfaFuel = this.qfaYabaTankOneReadings.slice(0);
      }
      if (tank == "tank6") {
        this.tankCapacity = this.qfaYabaTankTwoCapacity;
        this.qfaFuel = this.qfaYabaTankTwoReadings.slice(0);
      }
      this.getUsage();
      this.loadMap();
      await this.getChartLabel("to_fill");
      await this.getChartLabel("fuel_level");
    },
    getChartLabel(type) {
      if (
        !this.qfaOverheadReadings.length &&
        !this.qfaOverheadReadingsTwo.length &&
        !this.qfaAdmiraltyReadings.length &&
        !this.qfaHeadOfficeReadings.length &&
        !this.qfaYabaTankOneReadings.length &&
        !this.qfaYabaTankTwoReadings.length
      )
        return;
      switch (type) {
        case "to_fill":
          if (this.tank == "tank1") {
            for (const i in this.qfaOverheadReadings) {
              this.toFillReading1[0].data.push([
                new Date(this.qfaOverheadReadings[i].created_at).getTime(),
                (
                  this.qfaOverheadCapacity - this.qfaOverheadReadings[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank2") {
            for (const i in this.qfaOverheadReadingsTwo) {
              this.toFillReading2[0].data.push([
                new Date(this.qfaOverheadReadingsTwo[i].created_at).getTime(),
                (
                  this.qfaOverheadCapacityTwo -
                  this.qfaOverheadReadingsTwo[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank3") {
            for (const i in this.qfaAdmiraltyReadings) {
              this.toFillReading3[0].data.push([
                new Date(this.qfaAdmiraltyReadings[i].created_at).getTime(),
                (
                  this.qfaAdmiraltyCapacity - this.qfaAdmiraltyReadings[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank4") {
            for (const i in this.qfaHeadOfficeReadings) {
              this.toFillReading4[0].data.push([
                new Date(this.qfaHeadOfficeReadings[i].created_at).getTime(),
                (
                  this.qfaHeadOfficeCapacity -
                  this.qfaHeadOfficeReadings[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank5") {
            for (const i in this.qfaYabaTankOneReadings) {
              this.toFillReading5[0].data.push([
                new Date(this.qfaYabaTankOneReadings[i].created_at).getTime(),
                (
                  this.qfaYabaTankOneCapacity -
                  this.qfaYabaTankOneReadings[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank6") {
            for (const i in this.qfaYabaTankTwoReadings) {
              this.toFillReading6[0].data.push([
                new Date(this.qfaYabaTankTwoReadings[i].created_at).getTime(),
                (
                  this.qfaYabaTankTwoCapacity -
                  this.qfaYabaTankTwoReadings[i].value
                ).toFixed(2)
              ]);
            }
          }
          break;

        case "fuel_level":
          if (this.tank == "tank1") {
            for (const i in this.qfaOverheadReadings) {
              this.fuelLevelReading1[0].data.push([
                new Date(this.qfaOverheadReadings[i].created_at).getTime(),
                this.qfaOverheadReadings[i].value
              ]);
            }
          } else if (this.tank == "tank2") {
            for (const i in this.qfaOverheadReadingsTwo) {
              this.fuelLevelReading2[0].data.push([
                new Date(this.qfaOverheadReadingsTwo[i].created_at).getTime(),
                this.qfaOverheadReadingsTwo[i].value
              ]);
            }
          } else if (this.tank == "tank3") {
            for (const i in this.qfaAdmiraltyReadings) {
              this.fuelLevelReading3[0].data.push([
                new Date(this.qfaAdmiraltyReadings[i].created_at).getTime(),
                this.qfaAdmiraltyReadings[i].value
              ]);
            }
          } else if (this.tank == "tank4") {
            for (const i in this.qfaHeadOfficeReadings) {
              this.fuelLevelReading4[0].data.push([
                new Date(this.qfaHeadOfficeReadings[i].created_at).getTime(),
                this.qfaHeadOfficeReadings[i].value
              ]);
            }
          } else if (this.tank == "tank5") {
            for (const i in this.qfaYabaTankOneReadings) {
              this.fuelLevelReading5[0].data.push([
                new Date(this.qfaYabaTankOneReadings[i].created_at).getTime(),
                (
                  this.qfaYabaTankOneCapacity -
                  this.qfaYabaTankOneReadings[i].value
                ).toFixed(2)
              ]);
            }
          } else if (this.tank == "tank6") {
            for (const i in this.qfaYabaTankTwoReadings) {
              this.fuelLevelReading6[0].data.push([
                new Date(this.qfaYabaTankTwoReadings[i].created_at).getTime(),
                (
                  this.qfaYabaTankTwoCapacity -
                  this.qfaYabaTankTwoReadings[i].value
                ).toFixed(2)
              ]);
            }
          }
          break;
        default:
          break;
      }

      this.getUsage();
      this.setQfaChartData();
    },
    getChart() {},
    getChartData() {
      for (const i in this.data2) {
        this.temperature.push(this.data2[i].read.temperature);
      }

      for (const i in this.data2) {
        this.to_fill.push(this.data2[i].read.to_fill);
      }

      for (const i in this.data2) {
        this.fuel_level.push(this.data2[i].read.fuel_level);
      }
    },
    getTankParams() {
      if (this.tank === "tank1") {
        this.qfaFuel = this.qfaOverheadReadings.slice(0, 200);
        this.tankCapacity = this.qfaOverheadCapacity;
      } else if (this.tank === "tank2") {
        this.qfaFuel = this.qfaOverheadReadingsTwo.slice(0, 200);
        this.tankCapacity = this.qfaOverheadCapacityTwo;
      } else if (this.tank === "tank3") {
        this.qfaFuel = this.qfaAdmiraltyReadings.slice(0, 200);
        this.tankCapacity = this.qfaAdmiraltyCapacity;
      } else if (this.tank === "tank4") {
        this.qfaFuel = this.qfaHeadOfficeReadings.slice(0, 200);
        this.tankCapacity = this.qfaHeadOfficeCapacity;
      } else if (this.tank === "tank5") {
        this.qfaFuel = this.qfaYabaTankOneReadings.slice(0, 200);
        this.tankCapacity = this.qfaYabaTankOneCapacity;
      } else if (this.tank === "tank6") {
        this.qfaFuel = this.qfaYabaTankTwoReadings.slice(0, 200);
        this.tankCapacity = this.qfaYabaTankTwoCapacity;
      }
    },
    async getIotData() {
      this.$store.commit("iot/qfaOverheadReadings/toggleRefresh");
      this.$store.commit("iot/qfaOverheadReadingsTwo/toggleRefresh");
      this.$store.commit("iot/qfaAdmiraltyReadings/toggleRefresh");
      this.$store.commit("iot/qfaHeadOfficeReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankOneReadings/toggleRefresh");
      this.$store.commit("iot/qfaYabaTankTwoReadings/toggleRefresh");
      await this.getQfaOverheadReadings(this);
      await this.getQfaOverheadReadingsTwo(this);
      await this.getQfaAdmiraltyReadings(this);
      await this.getQfaHeadOfficeReadings(this);
      await this.getQfaYabaTankOneReadings(this);
      await this.getQfaYabaTankTwoReadings(this);
      this.getTankParams();
      // this.getChartData();
      this.loadMap();
      await this.getChartLabel("to_fill");
      await this.getChartLabel("fuel_level");
      this.setQfaChartData();
    },
    async goToPrevious() {
      this.tankData = [];
      this.data = [];
      this.data2 = [];
      let url = this.tankDetails.links.next;

      this.tankDetails = {};

      const response = await this.$axios.get(
        `${url}&&device_eui=${this.device_eui1}`,
        this.config
      );

      const response2 = await this.$axios.get(
        `${url}&&device_eui=${this.device_eui2}`,
        this.config
      );

      this.data = response.data.data;
      this.data2 = response2.data.data;

      this.details1 = response.data;
      this.details2 = response2.data;

      if (this.tank == "tank1") {
        this.tankDetails = this.details1;
        this.tankData = this.data;
      } else {
        this.tankDetails = this.details2;
        this.tankData = this.data2;
      }
      this.page = parseInt(this.tankDetails.meta.current_page);
      this.totalPages = parseInt(this.tankDetails.meta.last_page);

      // this.getChartData();
      this.loadMap();
      this.setQfaChartData();
    },
    async goToNext() {
      this.tankData = [];
      this.data = [];
      this.data2 = [];

      let url = this.tankDetails.links.prev;

      this.tankDetails = {};

      const response = await this.$axios.get(
        `${url}&&device_eui=${this.device_eui1}`,
        this.config
      );

      const response2 = await this.$axios.get(
        `${url}&&device_eui=${this.device_eui1}`,
        this.config
      );

      this.data = response.data.data;
      this.data2 = response2.data.data;

      this.details1 = response.data;
      this.details2 = response2.data;

      if (this.tank == "tank1") {
        this.tankDetails = this.details1;
        this.tankData = this.data1;
      } else {
        this.tankDetails = this.details2;

        this.tankData = this.data2;
      }

      this.page = parseInt(this.tankDetails.meta.current_page);
      this.totalPages = this.tankDetails.meta.last_page;

      let tank = [];

      // this.getChartData();
      this.loadMap();
    }
  },
  unmounted() {
    this.loadMap();
  },
  head: () => ({
    title: "Dashboard · IOT"
  }),
  meta: {
    pageName: "diesel-tanks.index"
  },
  middleware: ["auth"],
  mixins: [authMixin, iotMixin],
  watch: {
    tankData() {
      setInterval(() => this.getIotData(), 3600000);
    },
    tank(tank) {
      window.setInterval(this.getUsage(), 4000);
    }
  }
};
</script>

<style scoped>
.showed {
  display: block;
  animation-name: bounceIn;
  animation-duration: 4s;
  opacity: 1;
}
.disappear {
  display: none;
  visibility: hidden;
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
}

.calender {
  transition-property: display;
  transition-duration: 1000ms;
  transition-delay: 500ms;
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: fixed;
  right: 25px;
  top: 150px;
  z-index: 300;
  display: none;
}
.show {
  transition-property: display;
  transition-duration: 1s;
  transition-delay: 1s;
  display: block;
}

#map {
  height: 400px;

  width: 100%;
}

.map-cont {
  position: relative;
}
.tanks_dropdown {
  min-width: 121px;
  height: 21px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.tanks_dropdown:focus {
  outline: none;
}
.card {
  border-radius: 6px;
  height: 180px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.next_n_prev {
  display: flex;
  justify-content: center;
  align-items: center;
}
.next_n_prev {
  padding: 15px;
}

.next_n_prev > span {
  margin-left: 15px;
  margin-right: 15px;
}
.prev {
  border: none;
  height: 40px;
  width: 70px;
}
.next {
  border: none;
  height: 40px;
  width: 70px;
}
.prev:focus {
  outline: none;
}
.next:focus {
  outline: none;
}
.card > p {
  margin-top: -6px;
}

.card > h6 {
  font-weight: 900;
  text-transform: uppercase;
}
.card-label {
  margin-top: -5px;
  font-weight: 700;
  margin-bottom: 5px;
}
.meter {
  width: 100px;
}
.tank_details {
  display: none;
  background: rgba(36, 35, 35, 0.548);
  border-radius: 6px;
  color: white;
  padding: 10px;
  right: 100px;
  bottom: 30px;
  position: absolute;
}
.tank {
  position: relative;
}

.tank:hover > div {
  display: block;
}

/* .water--0:checked ~ .cylinder .water {
  bottom: -50px;
} */

.card-height {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 96px !important;
  box-shadow: 1px 0px 1px 2px rgba(0, 0, 0, 0.18);
  -webkit-box-shadow: 1px 0px 1px 2px rgba(0, 0, 0, 0.18);
  -moz-box-shadow: 1px 0px 1px 2px rgba(0, 0, 0, 0.18);
  /* justify-content: center; */
}

.icon-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 62px;
  width: 62px;
  /* padding: 5px; */
  background: rgba(241, 198, 103, 0.493);
}

#fuel-level {
  background: rgb(235, 186, 82);
}
#to-fill {
  background: rgb(134, 209, 134);
}
#tank-capacity {
  background: rgb(72, 215, 240);
}

#temperature {
  background: rgb(240, 73, 73);
}

.icon {
  font-size: 30px;
}

.level {
  margin-bottom: -5px;
  font-size: 17px;
  font-weight: 800;
}
</style>
