<template>
  <form id="edit-quotation-form" class="mg-t-10">
    <div class="table-responsive mg-t-10">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in items" :key="item.id">
          <td>
            <span>{{ index + 1 }}</span>
          </td>
          <td>
            <nuxt-link :to="`/hagul/inventory/materials/details?id=${
              thisOrThat(item.tenderItem, ['material', 'service']).id
            }`" class="tx-inverse tx-14 tx-medium d-block"
              v-text="thisOrThat(item.tenderItem, ['material', 'service']).name"></nuxt-link>
            <span class="tx-11 d-block" v-if="item.tenderItem.material">#{{
            thisOrThat(item.tenderItem, ["material", "service"]).code
            }}</span>
            <span class="tx-11 d-block" v-if="item.tenderItem.material">Stock:
              {{
              thisOrThat(item.tenderItem, ["material", "service"]).stock
              }}</span>
          </td>
          <td>
            <span v-text="item.tenderItem.quantity"></span>
          </td>
          <td>
            <small>{{ item.price | money }}</small>
            <input type="number" class="form-control" step="any" v-model="item.price" placeholder="Quantity"
              :name="`quantity-${item.id}`" :disabled="['rejected', 'po-gen'].includes(quotation.status.code)"
              required />
            <small class="text-danger">{{
            validationErrors[`quantity-${item.id}`]
            }}</small>
          </td>
        </tr>
      </table>
    </div>
    <!-- table-responsive -->

    <div class="form-layout-footer tx-center mg-t-20">
      <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submit()">SAVE</v-button>
    </div>
  </form>
</template>

<script>
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton },
  computed: {
    total() {
      return this.items.reduce(
        (total, item) =>
        (total += parseFloat(
          this.thisOrThat(item, ["material", "service"]).cost * item.quantity
        )),
        0
      );
    }
  },
  data: () => ({
    disabled: false,
    items: [],
    validationErrors: {}
  }),
  methods: {
    populateItems() {
      this.items = [];
      for (const item of this.quotation.items)
        this.items.push(Object.assign({ price: null }, item));
    },
    async submit() {
      if (!this.validateForm("edit-quotation-form")) return false;

      this.disabled = true;
      try {
        const response = await this.$axios.put(
          `quotations/${this.quotation.id}`,
          { items: this.items }
        );
        this.disabled = false;
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {}
      }
    }
  },
  mixins: [authMixin, formMixin],
  props: ["quotation"],
  watch: {
    quotation: {
      immediate: true,
      deep: true,
      handler(val) {
        this.populateItems();
      }
    }
  }
};
</script>
