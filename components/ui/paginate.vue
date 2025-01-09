<template>
  <div style="width: 100%;">
    <slot :list="paginatedList" :pages="pages"></slot>
    <slot name="linksWrapper" :list="paginatedList" :pages="pages">
      <div class="pagination-wrapper" v-if="pages.length > 1">
        <ul class="pagination mg-b-0">
          <li class="page-item" v-if="pagination.page != 1" @click="pagination.page--">
            <a class="page-link" href="#" aria-label="Previous">
              <i class="icon ion-ios-arrow-left"></i>
            </a>
          </li>
          <li class="page-item" :class="{ active: pagination.page == pageNumber }" v-for="pageNumber in pages.slice(
      pagination.page - 1,
      pagination.page + 5
    )" @click="pagination.page = pageNumber" :key="pageNumber">
            <a class="page-link" href="#" v-text="pageNumber"></a>
          </li>
          <li class="page-item hidden-xs-down" @click="pagination.page++" v-if="pagination.page < pages.length">
            <a class="page-link" href="#" aria-label="Last">
              <i class="icon ion-ios-arrow-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  computed: {
    paginatedList() {
      var numberOfPages = Math.ceil(this.list?.length / this.perPage);
      this.pages = [];
      for (var index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
      var from = this.pagination.page * this.perPage - this.perPage;
      var to = this.pagination.page * this.perPage;
      return this.list ? this.list?.slice(from, to) : [];
    }
  },
  data: () => ({
    pagination: {
      page: 1,
      pages: []
    }
  }),
  props: ["list", "perPage"]
};
</script>
