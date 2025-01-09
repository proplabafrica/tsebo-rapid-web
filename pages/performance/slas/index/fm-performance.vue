<template>
    <div class="container">
        <!-- slim-pageheader -->

        <div class="container">
            <div class="row">
                <div class="col-md-6 pd-x-0">
                    <input type="text" placeholder="Start typing here to search"
                        class="form-control wd-md-250 mg-t-5 mg-b-10 float-left" v-model="search" />
                </div>

                <div class="col-md-6 pd-x-0">
                    <select class="form-control mg-t-5 mg-b-10 tx-capitalize wd-md-250 float-md-right"
                        @click="shouldOpenDate = !shouldOpenDate">
                        <option v-if="range?.start !== null">
                            {{ toReadableDate(range?.start) }}
                            -
                            {{ toReadableDate(range?.end) }}
                        </option>
                        <option v-if="range?.start == null">Choose Date</option>
                    </select>
                    <div class="date" v-if="shouldOpenDate" style="position: absolute; top: 50px">
                        <DatePicker v-model="range" is-range :disabled-dates="{ start: new Date(), end: null }">
                        </DatePicker>
                    </div>
                </div>


            </div>
        </div>



        <div>


            <!-- TABLE -->
            <v-paginate class="bg-white" :list="getPerformanceArray" :perPage="perPage" v-if="!loading">
                <template v-slot="paginate">
                    <div class="table-responsive" id="p-orders">
                        <table class="table table-striped mg-b-0 tx-13">
                            <thead>
                                <tr class="tx-10">
                                    <th class="pd-y-5">S/N</th>
                                    <th class="pd-y-5" width="30%">Facility Manager</th>
                                    <th class="pd-y-5">SLA Adherance</th>
                                    <th class="pd-y-5">No of Requests</th>
                                    <th class="pd-y-5">Completed</th>
                                    <th class="pd-y-5">In Progress</th>
                                    <th class="pd-y-5">Average hour</th>
                                    <th class="pd-y-5">Total Revenue</th>
                                    <th class="pd-y-5">Overall Performance</th>
                                </tr>
                            </thead>
                            <tbody v-if="paginate.list.length > 0">
                                <tr v-for="(fm, index) in paginate.list">
                                    <td :class="!fm.active ? 'bg-danger text-white' : ''">
                                        <span>{{ index }}</span>
                                    </td>
                                    <td :class="!fm.active ? 'bg-danger text-white' : ''">
                                        <span>{{ fm.name }}</span>
                                    </td>
                                    <td :class="parseFloat(fm.sla_adherence) < 60 ? 'text-danger' : ''">
                                        <span>{{ fm.sla_adherence }}%</span>
                                    </td>
                                    <td>
                                        <span>{{ fm.total_requests }}</span>
                                    </td>
                                    <td>
                                        <span>{{ fm.no_of_completed_requests }}</span>
                                    </td>
                                    <td class="bg-success" v-if="fm.in_progress === 0">
                                        <!-- <span>92%</span> -->
                                    </td>
                                    <td class="" v-if="fm.in_progress > 0">
                                        <span> {{ fm.in_progress }}</span>
                                    </td>
                                    <td>
                                        <span>{{ fm.avg_hour }}</span>
                                    </td>
                                    <td>
                                        <span>{{ fm.total_revenue }}M</span>
                                    </td>
                                    <td class="text-white"
                                        :class="parseFloat(fm.overall_performance) > 60 ? 'bg-success' : parseFloat(fm.overall_performance) === 60 ? 'bg-orange' : 'bg-danger'">
                                        <span>{{ fm.overall_performance }}%</span>
                                    </td>
                                </tr>
                                <tr style="background-color: #125195;color:#fff">
                                    <td class="">
                                    </td>
                                    <td class="">
                                    </td>
                                    <td>
                                        <span class="text-white">{{ total?.avgSla }}%</span>
                                    </td>
                                    <td>
                                        <span class="text-white">{{ total?.totalNoOfRequests }}</span>
                                    </td>
                                    <td>
                                        <span class="text-white">{{ total?.totalCompletedRequests }}</span>
                                    </td>
                                    <td>
                                        <span class="text-white"> {{ total?.totalRequestsInProgress }}</span>
                                    </td>
                                    <td>
                                        <span class="text-white">{{ total?.averageHour }}</span>
                                    </td>
                                    <td>
                                        <span class="text-white">{{ total?.totalRevenue }}M</span>
                                    </td>
                                    <td class="text-white">
                                        <span></span>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    <td colspan="12">
                                        <h5>No data to display</h5>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
            </v-paginate>

            <loading v-else />

        </div>

    </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { mapActions, mapState } from "vuex";


export default {
    components: { loading, vPaginate, Calendar, DatePicker },

    data: () => ({
        controller: new AbortController(),
        signal: null,
        interval: null,
        loading: true,
        checker: 0,
        shouldOpenDate: false,
        perPage: 100,
        search: null,
        dates: [
            {
                date: new Date()
            }
        ],
        range: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0],
            end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
        },
        performance: [],

    }),
    computed: {


        getPerformanceArray() {
            if (this.performance && this.performance?.length) {
                if (this.search && this.search.length) {
                    return this.performance.filter(p => p.total_requests > 0 && p.name.toLowerCase().includes(this.search.toLowerCase())).sort((a, b) => b.overall_performance - a.overall_performance)

                } else {

                    return this.performance.filter(p => p.total_requests > 0).sort((a, b) => b.overall_performance - a.overall_performance);
                }
            } else {
                return []
            }

        },
        total() {
            const format = {
                avgSla: 0,
                totalNoOfRequests: 0,
                totalCompletedRequests: 0,
                totalRequestsInProgress: 0,
                averageHour: 0,
                totalRevenue: 0,
            }

            format.avgSla = ((this.performance.reduce((a, b) => a + parseFloat(b.sla_adherence), 0)) / this.performance.length).toFixed(2);
            format.totalNoOfRequests = (this.performance.reduce((a, b) => a + parseFloat(b.total_requests), 0))
            format.totalCompletedRequests = (this.performance.reduce((a, b) => a + parseFloat(b.no_of_completed_requests), 0));

            format.totalRequestsInProgress = (this.performance.reduce((a, b) => a + parseFloat(b.in_progress), 0));
            format.averageHour = ((this.performance.reduce((a, b) => a + parseFloat(b.avg_hour), 0)) / this.performance.length).toFixed(2);
            format.totalRevenue = (this.performance.reduce((a, b) => a + parseFloat(b.total_revenue), 0))

            return format
        }
    },
    async created() {
        const perf = this.getPerformance(this)

        this.performance = perf

        this.$emit('updateVals', [{
            label: 'Home',
            link: '/'
        },
        {
            label: 'Performance',
            link: '/performance/slas'
        },
        {
            label: 'Facility Managers',
        }], 'Facility Managers Performance', false)

        if (!this.performance || !this.performance.length) {
            await this.getFmPerformance(this);

        } else {
            this.loading = false;

        }


    },

    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        ...mapActions({
            getFmPerformance: "performance/fmPerformance/getFmPerformance",
            getPerformance: "performance/fmPerformance/getPerformance",

        }),

        getPerformanceArray() {
            if (this.performance && this.performance?.length) {
                if (this.search && this.search.length) {
                    return this.performance.filter(p => p.total_requests > 0 && p.name.toLowerCase().includes(this.search.toLowerCase())).sort((a, b) => b.overall_performance - a.overall_performance)

                } else {

                    return this.performance.filter(p => p.total_requests > 0).sort((a, b) => b.overall_performance - a.overall_performance);
                }
            } else {
                return []
            }

        },

        toReadableDate(date) {
            if (date) {
                let thedate = new Date(date).toUTCString();

                let day = thedate.split(" ")[1];

                let month = thedate.split(" ")[2];

                let year = thedate.split(" ")[3];

                if (day && month && year) return day + " " + month + " " + year;
            }
        },
        async getStoredFmPerformance() {
            const perf = await this.getPerformance()

            if (perf && perf.length) {
                this.performance = perf

                this.loading = false;
                this.controller.abort()

                clearInterval(this.interval)
            }
        },
        async filterPerformance() {
            await this.getFmPerformance(this)
            this.getStoredFmPerformance()
        }

    },
    watch: {
        range(val) {
            if (val?.start && val?.end) {
                this.shouldOpenDate = false;
                this.filterPerformance()

            }


        }

    },
    head: () => ({
        title: "Admin Dashboard · Filmo",
    }),
    middleware: ["auth"],
    meta: {
        pageName: "dashboard.org-admin",
    },
    mixins: [authMixin],
};
</script>import { format } from "core-js/core/date";
