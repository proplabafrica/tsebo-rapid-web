<template>
  <div class="col-12 col-md pd-0 mg-t-20 mg-md-t-0-force">
    <ul class="list-group">
    
      <li class="list-group-item list-header">
        <h6>
          {{ name }}
        </h6>
      </li>
      <div v-if="!workRequestsLoading && workRequests.length > 0">
        <li
          class="list-group-item"
          v-for="workRequest in getWorkRequestSearched"
          :key="workRequest.id"
        >
          <quick-request-data :workRequest="workRequest" />
        </li>
      </div>
      <div v-else-if="!workRequestsLoading">
        <li class="list-group-item">
          <h5>No data to display</h5>
        </li>
      </div>
      <loading v-else />
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import loading from '@/components/ui/loading'
import quickRequestData from '@/components/maintenance/requests/quick-data'

export default {
  components: { loading, quickRequestData },
  created () {
    this.fetchWorkRequests()
  },
  computed: {
    getWorkRequestSearched () {
   
      return this.workRequests.filter(
        request =>
          request.name
            .toLowerCase()
            .includes(this.workRequestSearch.toLowerCase())   ||
          request.unit && request.unit.name.toLowerCase().includes(this.workRequestSearch.toLowerCase())
      )
    }
  },
  data: () => ({
    shouldSearch: false,
    workRequests: [],
    workRequestsLoading: true,
    workRequestsSortBy: 'updated_at',
    workRequestsSortOrder: 'desc'
  }),
  methods: {
    ...mapActions({
      getWorkRequests: 'maintenance/workRequests/getWorkRequests'
    }),
    async fetchWorkRequests () {
      const columnData = Object.assign(
        {},
        this.$store.state.maintenance.workRequests.workRequestColumnData
      )[this.name]

      if (columnData && this.shouldSearch == false) {
        this.workRequests = columnData.workRequests
        this.workRequestsLoading = columnData.workRequestsLoading
        return
      }
      await this.getWorkRequests(this)

      this.workRequests = this.workRequests.filter(workRequest =>
        this.workRequestStatusCodes.includes(workRequest.status.code)
      )
      const { workRequests, workRequestsLoading } = this
      this.$store.commit('maintenance/workRequests/setWorkRequestColumnData', {
        column: this.name,
        data: Object.assign({}, { workRequests, workRequestsLoading })
      })
      this.shouldSearch = false
    }
  },
  props: [
    'name',
    'workRequestsPerPage',
    'workRequestSearch',
    'workRequestStatusCodes'
  ]
  // watch: {
  //   workRequestSearch (search) {
  //     this.debounce(() => {
  //       this.shouldSearch = true
  //       this.fetchWorkRequests()
  //     }, 300)
  //   }
  // }
}
</script>
