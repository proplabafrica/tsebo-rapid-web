<template>
  <div>
    <!-- <input
      type="text"
      placeholder="Start typing here to search"
      class="form-control wd-200 mg-t-5 mg-b-10 float-left"
      v-model="invoiceSearch"
    /> -->
    <select class="form-control wd-200 mg-t-5 mg-b-10 float-right tx-capitalize" v-model="invoiceScope">
      <option v-for="(statuses, scope) in invoiceScopeStatuses" :key="scope">
        {{ scope }}
      </option>
    </select>
    <v-paginate class="mg-t-5" v-if="!invoicesLoading" :list="invoices" perPage="100">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th width="25%">Info</th>
                <th>People</th>
                <th>Status</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="invoice in paginate.list" :key="`invoices-list-${invoice.id}`">
                <td>
                  <nuxt-link class="d-block tx-inverse tx-bold" :to="`/finance/invoices/details?id=${invoice.id}`">{{
                  invoice.code }}</nuxt-link>
                  <span class="tx-inverse">{{
                  { value: invoice.total } | toMoney
                  }}</span>
                  <span v-if="
                    invoice.workRequests && authorized('work-requests.show')
                  ">
                    <nuxt-link class="d-block tx-inverse" v-for="workRequest in invoice.workRequests"
                      :key="workRequest.id" :to="`/maintenance/requests/details?id=${workRequest.id}`">{{
                      workRequest.name }}</nuxt-link>
                  </span>
                  <span v-else-if="workRequest">{{ workRequest.name }}</span>
                </td>
                <td>
                  <span class="tx-inverse">
                    <b>Created By:</b>
                    {{ invoice.createdBy.name }}
                  </span>
                  <span class="tx-inverse" v-if="invoice.userBilledTo">
                    <b>Billed To:</b>
                    {{ invoice.userBilledTo.name }}
                  </span>
                </td>
                <td>
                  <span class="tx-inverse">{{ invoice.status.name }}</span>
                </td>
                <td>
                  <span class="tx-inverse">{{
                  invoice.created_at | dateFormat
                  }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">
                  <h4>No data to display</h4>
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
</template>

<script>
import { mapActions } from 'vuex'
import loading from '@/components/ui/loading'
import vPaginate from '@/components/ui/paginate'
import authMixin from '@/mixins/auth'

export default {
  components: { loading, vPaginate },
  created() {
    this.setScope(this.invoiceScope)
  },
  data: () => ({
    invoices: [],
    invoicesLoading: true,
    invoiceScope: 'all',
    invoiceSearch: null,
    invoiceStatusCodes: []
  }),
  head: () => ({
    title: 'Invoices · Tsebo-Rapid'
  }),
  meta: {
    pageName: 'invoices.index'
  },
  methods: {
    ...mapActions({
      getInvoices: 'finance/invoices/getInvoices'
    }),
    async setScope(scope) {
      this.invoiceStatusCodes = this.invoiceScopeStatuses[scope]
      this.$store.commit('finance/invoices/toggleRefresh')
      await this.getInvoices(this)
    }
  },
  middleware: ['auth', 'roleGuard'],
  mixins: [authMixin],
  props: ['invoiceScopeStatuses'],
  watch: {
    invoiceScope(scope) {
      this.setScope(scope)
    },
    invoiceSearch(search) {
      this.debounce(() => {
        this.getInvoices(this)
      }, 300)
    }
  }
}
</script>
