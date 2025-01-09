<template>
    <div>
        <div class="row row-xs">
            <div class="col-12 col-md mg-b-10 mg-md-b-0">
                <div>
                    <materials-chart />
                </div>
            </div>
            <div class="col-12 col-md mg-b-10 mg-md-b-0">
                <div>
                    <sales-chart />
                </div>
            </div>

            <div class="col-12 col-md mg-b-10 mg-md-b-0" v-show="false">
                <div class="container-xs">
                    <div class="row row-xs mg-t-10 mg-t-10 d-flex flex-column">
                        <div class="float-right mg-b-10">
                            <div class="card-header"
                                :style="{ backgroundColor: '#e3e7f2', paddingRight: '10px', paddingLeft: '10px' }">
                                <h6 class="slim-card-title"
                                    :style="{ backgroundColor: '#e3e7f2', paddingRight: '20px', paddingLeft: '20px' }">
                                    Sales & Purchase Chart</h6>
                            </div>

                            <div v-if="!isSalesListLoading" class="row-lg">
                                <div class="card card-status card-height col col-sm-12 col-12 col-xs-12">
                                    <div id="hagul-sales"></div>
                                </div>
                                <div class="card card-status card-height col col-sm-12 col-12 col-xs-12">
                                    <div id="hagul-purchase"></div>
                                </div>
                            </div>
                            <loading v-else />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>

import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import materialsChart from "@/components/ui/materials-chart";
import salesChart from "@/components/ui/sales-chart";
import moment from "moment";
import { mapActions } from "vuex";
import slaMixin from "@/mixins/performance/sla";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import ApexCharts from "apexcharts";



export default {
    components: {
        loading,
        vModal,
        materialsChart,
        salesChart,
    },
    async created() {
        await this.getPurchaseList();
        await this.getOrders();
        await this.getSalesOrderList();
        this.renderSalesChart();
        this.renderPurchaseChart();

    },

    data: () => ({
        approvalMonths: [],
        months: [],
        workPastSla: 0,
        worksPastSla: [],
        numberOfMonthsBack: 12,
        rangeBy: "updated_at",
        reportLoading: true,

        workRequests: [],

        worksPastSlaPerMonth: 0,
        workRequestsLoading: true,
        workRequestsSortBy: "updated_at",
        workRequestsSortOrder: "desc",
        disabled: false,
        user: null,
        userLoading: true,


        ratingsLoading: true,
        rateableCodes: ["work_requests"],
        workRequestStatusCodes: ["60", "65", "80"],
        isClient: false,
        requestsLoading: true,


        salesOrderInput: [],
        salesOrdersRangeFrom: null,
        salesOrdersRangeTo: null,
        salesOrderItems: [],
        salesOrderItemsLoading: true,
        isSalesListLoading: true,
        firstSalesDate: [],
        newlyGottenSalesDate: [],
        formattedSalesDate: [],
        salesOrderMade: [],
        monthlySalesReport: [],
        purchaseOrdersRangeFrom: null,
        purchaseOrdersRangeTo: null,
        purchaseOrderItems: [],
        firstPurchaseDate: [],
        newlyGottenPurchaseDate: [],
        formattedPurchaseDate: [],
        purchaseOrderMade: [],
        monthlyPurchaseReport: [],
        salesOrderItems: [],
        salesOrderStatusCodes: ['pending'],
    }),
    methods: {
        ...mapActions({
            getWorkRequests: "maintenance/workRequests/getWorkRequests",
        }),

        onChange(event) {
            const code = event.target.value;

            if (code !== "all") {
                const maintenanceTypeCodes = [];

                maintenanceTypeCodes.push(code);
                this.setMonths(maintenanceTypeCodes);
                return;
            }
            this.setMonths();
        },
        monthStartAndEnd(date) {
            return {
                name: moment(date).format('MMMM YYYY'),
                rangeFrom: moment(
                    new Date(date.getFullYear(), date.getMonth(), 1)
                ).format('YYYY-MM-DD h:mm:ss'),
                rangeTo: moment(
                    new Date(date.getFullYear(), date.getMonth() + 1, 0)
                ).format('YYYY-MM-DD h:mm:ss')
            }
        },
        async getOrders() {
            var currentDate = new Date();
            const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(currentDate);
            this.salesOrdersRangeFrom = rangeFrom;
            this.salesOrdersRangeTo = rangeTo;

            try {
                const response = await this.$axios("sales-orders", {
                    params: {
                        associations: ["status", "type", "workRequests.status"],
                        rangeBy: "updated_at",
                        rangeFrom: this.salesOrdersRangeFrom,
                        rangeTo: this.salesOrdersRangeTo,
                    }
                });
                this.salesOrderItems = response.data.data;
                this.salesOrderItemsLoading = false;
                // this.salesOrderItems)

            } catch (error) {
                console.log(error)
            }
        },
        async getSalesOrderList() {
            this.isSalesListLoading = true;
            await this.getOrders();
            let initialSalesList = [];
            for (let salesList of this.salesOrderItems) {
                if (this.salesOrderItems.length > 0) {
                    initialSalesList.push(salesList.created_at.slice(0, 10));
                }
            }
            // initialSalesList);

            this.firstSalesDate = initialSalesList;
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (let i = 0; i < this.firstSalesDate.length; i++) {
                if (this.firstSalesDate.length > 0) {
                    this.newlyGottenSalesDate.push(months[this.firstSalesDate[i].split("-")[1] - 1],
                        this.firstSalesDate[i].split("-")[2] + "th",
                        this.firstSalesDate[i].split("-")[0])
                }
                this.formattedSalesDate;
            }
            for (let i = 1; i < this.newlyGottenSalesDate.length; i++) {
                if (i % 3 === 0) {
                    this.formattedSalesDate.push(this.newlyGottenSalesDate[i - 2] + " " + this.newlyGottenSalesDate[i] + " " + this.newlyGottenSalesDate[i - 1])
                }
                this.formattedSalesDate;
            }
            // this.formattedSalesDate);

            const currentDate = new Date();
            let all = [];

            if (currentDate.getMonth() + 1 <= 13) {
                for (var i = currentDate.getMonth(); i > currentDate.getMonth() - 9; i--) {
                    if (i < 0) {
                        all.push({ month: i + 13, year: currentDate.getFullYear() - 1 })
                    } else {
                        all.push({ month: i + 1, year: currentDate.getFullYear() })
                    }
                }
            } else {
                for (var i = currentDate.getMonth(); i > currentDate.getMonth() - 9; i--) {
                    if (i < 0) {
                        all.push({ month: i + 13, year: currentDate.getFullYear() - 1 })
                    } else {
                        all.push({ month: i + 1, year: currentDate.getFullYear() })
                    }
                }
            }
            // all);

            let theDate = [];

            for (var i = 0; i < all.length; i++) {
                theDate.push({ ...all[i], month: months[all[i].month - 1] })
            }


            const filteredCurrent = theDate.filter(req =>
                req.year.toString().includes(currentDate.getFullYear())
            )


            const filteredB4 = theDate.filter(req =>
                req.year.toString().includes(currentDate.getFullYear() - 1)
            )


            let filteredCurrentCount = []
            for (var i = 0; i < this.formattedSalesDate.length; i++) {
                for (var j = 0; j < filteredCurrent.length; j++) {
                    if (this.formattedSalesDate[i].split(" ")[2] == (currentDate.getFullYear()) && this.formattedSalesDate[i].toString().includes(filteredCurrent[j].month)) {
                        filteredCurrentCount.push(filteredCurrent[j].month)
                    }
                }
            }

            // filteredCurrentCount.length);

            let filteredCurrentBefore = []
            for (var i = 0; i < this.formattedSalesDate.length; i++) {
                for (var j = 0; j < filteredB4.length; j++) {
                    if (this.formattedSalesDate[i].split(" ")[2] == (currentDate.getFullYear() - 1) && this.formattedSalesDate[i].toString().includes(filteredB4[j].month)) {
                        filteredCurrentBefore.push(filteredB4[j].month)
                    }
                }
            }
            // filteredCurrentBefore.length);

            let itemArrayCount = new Array(months.length).fill(0);
            // itemArrayCount)

            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < filteredCurrentCount.length; j++) {
                    if (filteredCurrentCount[j].includes(months[i])) {
                        itemArrayCount[i]++;
                    }
                }
            }

            let itemArrayB4 = new Array(months.length).fill(0);

            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < filteredCurrentBefore.length; j++) {
                    if (filteredCurrentBefore[j].includes(months[i])) {
                        itemArrayB4[i]++;
                    }
                }
            }
            // itemArrayB4)
            // itemArrayCount)

            let pattern = []
            for (var i = 0; i < itemArrayB4.length; i++) {
                if (itemArrayB4[i] > 0) {
                    pattern.push(itemArrayB4[i])
                }
            }


            const currentYear = itemArrayCount.filter(req => req > 0)
            const previousYear = itemArrayB4.filter(req => req > 0 || itemArrayB4.length === 0);
            currentYear.reverse();
            // currentYear.reverse())
            // previousYear)
            // previousYear.length)

            for (let i = 0; i < previousYear.length; i++) {
                if (previousYear[i] > 0) {
                    currentYear.push(previousYear[i])
                    // this.salesOrderMade.push(currentYear[i])
                }
            }

            for (var i = 0; i < currentYear.length; i++) {
                this.salesOrderMade.push(currentYear[i])
            }
            // "this.salesOrderMade_______________", this.salesOrderMade)


            let dateArray = []
            for (let i = 0; i < theDate.length; i++) {
                if (theDate.length > 0) {
                    dateArray.push(theDate[i].month.slice(0, 3) + " " + theDate[i].year)
                }

            }
            if (!this.monthlySalesReport.length) {
                this.monthlySalesReport = dateArray.slice(0, 6).reverse();
            }
            // "this.monthlySalesReport_______________", this.monthlySalesReport)

            this.isSalesListLoading = false;

        },
        async getPurchaseOrder() {
            var currentDate = new Date();
            const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(currentDate);
            this.purchaseOrdersRangeFrom = rangeFrom;
            this.purchaseOrdersRangeTo = rangeTo;

            try {
                const response = await this.$axios("purchase-orders");
                this.purchaseOrderItems = response.data.data;


            } catch (error) {
                console.log(error.message)
            }

        },
        async getPurchaseList() {
            this.isSalesListLoading = true;
            await this.getPurchaseOrder();
            let initialPurchaseList = [];
            for (let purchaseList of this.purchaseOrderItems) {
                if (this.purchaseOrderItems.length > 0) {
                    initialPurchaseList.push(purchaseList.created_at.slice(0, 10));
                }
            }
            // "PURCHASELIST", initialPurchaseList);

            this.firstPurchaseDate = initialPurchaseList;
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for (let i = 0; i < this.firstPurchaseDate.length; i++) {
                if (this.firstPurchaseDate.length > 0) {
                    this.newlyGottenPurchaseDate.push(months[this.firstPurchaseDate[i].split("-")[1] - 1],
                        this.firstPurchaseDate[i].split("-")[2] + "th",
                        this.firstPurchaseDate[i].split("-")[0])
                }
            }
            // this.newlyGottenPurchaseDate);
            for (let i = 0; i < this.newlyGottenPurchaseDate.length; i++) {
                if (i % 3 === 0) {
                    this.formattedPurchaseDate.push(this.newlyGottenPurchaseDate[i + 1] + " " + this.newlyGottenPurchaseDate[i] + " " + this.newlyGottenPurchaseDate[i + 2])
                }
                this.formattedPurchaseDate;
            }
            // this.formattedPurchaseDate);

            const currentDate = new Date();
            let all = [];

            if (currentDate.getMonth() + 1 <= 13) {
                for (var i = currentDate.getMonth(); i > currentDate.getMonth() - 9; i--) {
                    if (i < 0) {
                        all.push({ month: i + 13, year: currentDate.getFullYear() - 1 })
                    } else {
                        all.push({ month: i + 1, year: currentDate.getFullYear() })
                    }
                }
            }
            else {
                for (var i = currentDate.getMonth(); i > currentDate.getMonth() - 9; i--) {
                    if (i < 0) {
                        all.push({ month: i + 13, year: currentDate.getFullYear() - 1 })
                    } else {
                        all.push({ month: i + 1, year: currentDate.getFullYear() })
                    }
                }
            }
            // all)

            let theDate = [];

            for (var i = 0; i < all.length; i++) {
                theDate.push({ ...all[i], month: months[all[i].month - 1] })
            }
            // theDate);

            const filteredCurrent = theDate.filter(req =>
                req.year.toString().includes(currentDate.getFullYear())
            )
            // filteredCurrent);

            const filteredB4 = theDate.filter(req =>
                req.year.toString().includes(currentDate.getFullYear() - 1)
            )
            // filteredB4);

            let filteredCurrentCount = []
            for (var i = 0; i < this.formattedPurchaseDate.length; i++) {
                for (var j = 0; j < filteredCurrent.length; j++) {
                    if (this.formattedPurchaseDate[i].split(" ")[2] == (currentDate.getFullYear()) && this.formattedPurchaseDate[i].toString().includes(filteredCurrent[j].month)) {
                        filteredCurrentCount.push(filteredCurrent[j].month)
                    }
                }
            }

            // filteredCurrentCount);

            let filteredCurrentBefore = []
            for (var i = 0; i < this.formattedPurchaseDate.length; i++) {
                for (var j = 0; j < filteredB4.length; j++) {
                    if (this.formattedPurchaseDate[i].split(" ")[2] == (currentDate.getFullYear() - 1) && this.formattedPurchaseDate[i].toString().includes(filteredB4[j].month)) {
                        filteredCurrentBefore.push(filteredB4[j].month)
                    }
                }
            }
            // filteredCurrentBefore);

            let itemArrayCount = new Array(months.length).fill(0);
            // itemArrayCount)

            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < filteredCurrentCount.length; j++) {
                    if (filteredCurrentCount[j].includes(months[i])) {
                        itemArrayCount[i]++;
                    }
                }
            }

            let itemArrayB4 = new Array(months.length).fill(0);

            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < filteredCurrentBefore.length; j++) {
                    if (filteredCurrentBefore[j].includes(months[i])) {
                        itemArrayB4[i]++;
                    }
                }
            }
            // itemArrayB4)
            // itemArrayCount)

            let patternBefore = [];
            for (var i = 0; i < itemArrayB4.length; i++) {
                if (itemArrayB4[i]) {
                    patternBefore.push(itemArrayB4[i])
                }
            }
            // patternBefore)

            let sliceArrayBefore = []
            if (itemArrayB4) {
                sliceArrayBefore = itemArrayB4.slice(9, 12)
            }
            // "array.......", sliceArrayBefore);
            // itemArrayB4.length);

            let patternCurrent = []
            for (var i = 0; i < itemArrayCount.length; i++) {
                if (itemArrayB4[i]) {
                    patternCurrent.push(itemArrayCount[i])
                }
            }

            let sliceArrayCurrent = [];
            if (itemArrayCount) {
                sliceArrayCurrent = itemArrayCount.slice(0, 3);
                sliceArrayCurrent.reverse();
                this.purchaseOrderMade = sliceArrayBefore;
            }
            // "arrayCurrent.......",  sliceArrayCurrent);
            // "purchase order.....", this.purchaseOrderMade);

            for (let i = 0; i < sliceArrayCurrent.length; i++) {
                if (sliceArrayCurrent.length > 0) {
                    this.purchaseOrderMade.push(sliceArrayCurrent[i])
                }

            }
            // "this.purchaseOrderMade_______________", this.purchaseOrderMade);


        },
        async renderSalesChart() {
            var salesChartOptions = {

                tooltip: {
                    x: {
                        format: "dd/MM/yy HH:mm"
                    }
                },
                series: this.salesOrderMade,

                chart: {
                    width: '90%',
                    type: 'pie',
                    id: "hagul-sales",
                    height: 300,
                },
                labels: this.monthlySalesReport.reverse(),
                colors: ["#247BA0"],
                // colors: ["#868689", "#247BA0"],
                theme: {
                    monochrome: {
                        enabled: true
                    }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            offset: -5
                        }
                    }
                },
                title: {
                    text: "Sales Order"
                },
                dataLabels: {
                    formatter(val, opts) {
                        const name = opts.w.globals.labels[opts.seriesIndex]
                        return [name, val.toFixed(1) + '%']
                    }
                },
                legend: {
                    show: false
                }

            };
            var approvalSalesChart = new ApexCharts(
                document.querySelector("#hagul-sales"),
                salesChartOptions
            );
            await approvalSalesChart.render();
        },
        async renderPurchaseChart() {
            var purchaseChartOptions = {

                tooltip: {
                    x: {
                        format: "dd/MM/yy HH:mm"
                    }
                },
                series: this.purchaseOrderMade,

                chart: {
                    width: '90%',
                    type: 'pie',
                    id: "hagul-purchase",
                    height: 300,
                },
                labels: this.monthlySalesReport.reverse(),
                colors: ["#868689"],
                // colors: ["#868689", "#247BA0"],
                theme: {
                    monochrome: {
                        enabled: true
                    }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            offset: -5
                        }
                    }
                },
                title: {
                    text: "Purchase Order"
                },
                dataLabels: {
                    formatter(val, opts) {
                        const name = opts.w.globals.labels[opts.seriesIndex]
                        return [name, val.toFixed(1) + '%']
                    }
                },
                legend: {
                    show: false
                }

            };
            var approvalPurchaseChart = new ApexCharts(
                document.querySelector("#hagul-purchase"),
                purchaseChartOptions
            );
            await approvalPurchaseChart.render();
        }
    },

    middleware: ["auth"],
    watch: {
        $route(to, from) {
            if (to.query.id != from.query.id) return this.setUser(to.query.id);
        },
    },
    mixins: [slaMixin, authMixin, modalMixin],

    //   props: ["monthStartAndEnd", "range"],
};
</script>

<style scoped></style>