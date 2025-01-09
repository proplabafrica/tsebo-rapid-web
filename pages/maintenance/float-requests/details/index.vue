<template>
  <form id="float-request-items-form" class="pd-30 bg-white" v-if="floatRequest.status.code == 'pending'">
    <div class="row">
      <div class="form-group col-md-8">
        <label for="description" class="form-control-label">Description</label>
        <textarea name="description" v-model="editedFloatRequest.description" class="form-control"
          placeholder="Description"></textarea>
      </div>

      <div class="form-group col">
        <label class="form-control-label">Attachment (Max 2MB)</label>
        <div class="custom-file">
          <input type="file" @change="
            convertToBase64($event).then((data) => {
              editedFloatRequest.file = data.file;
              editedFloatRequest.file_name = data.file_name;
            })
          " class="custom-file-input" title="Select an image 1MB or less" name="file" />
          <label class="custom-file-label" for="customFile" v-text="editedFloatRequest.file_name"></label>
        </div>
        <!-- custom-file -->
        <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
      </div>
    </div>
    <!-- row -->

    <div class="slim-card-title">
      Items (TOTAL: {{ { value: total } | toMoney }})
    </div>
    <span class="btn btn-primary" id="add-items" v-if="editedFloatRequest.items.length < 1" @click="add1Item()">ADD
      ITEMS</span>
    <div class="row mg-t-20 items-input" v-for="(item, index) in editedFloatRequest.items" :key="`item-${index}`">
      <div class="form-group col-md-4">
        <label class="form-control-label">
          Description
          <span class="tx-danger">*</span>
        </label>
        <input type="text" class="form-control" v-model="item.description" :name="`item-description-${index}`" required
          placeholder="Item Description" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`item-description-${index}`]"></small>
      </div>
      <div class="form-group col-md-4">
        <label class="form-control-label">
          Cost
          <span class="tx-danger">*</span> ({{
          { value: item.cost } | toMoney
          }})
        </label>
        <input type="number" step="any" class="form-control" v-model="item.cost" :name="`item-cost-${index}`" required
          placeholder="Item Cost" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`item-cost-${index}`]"></small>
      </div>

      <div class="form-group col-md-4">
        <label class="form-control-label">
          Quantity
          <span class="tx-danger">*</span>
        </label>
        <input type="number" step="any" class="form-control" v-model="item.quantity" :name="`item-quantity-${index}`"
          required placeholder="Item Quantity" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`item-quantity-${index}`]"></small>
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Item()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span v-modal-open="'delete-float-request-item-modal'" @click="
          itemToDelete = item;
          itemToDeleteIndex = index;
        " class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>
    </div>
    <div class="form-layout-footer tx-center mg-t-20">
      <v-button class="btn btn-primary mg-5" @click="updateFloatRequest()" :disabled="disabled">SAVE</v-button>
    </div>
    <v-modal ref="delete-float-request-item-modal" v-if="itemToDelete">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'delete-float-request-item-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block">&#9888;</span>
            <h4 class="mg-b-20">
              Delete
              {{
              itemToDelete.description
              ? itemToDelete.description
              : "this item"
              }}?
            </h4>
            <v-button type="button" class="btn btn-danger pd-x-25" :disabled="disableDelete" @click="deleteItem()">
              <i class="icon ion-ios-checkmark-outline"></i> Delete
            </v-button>
            <button type="button" class="btn btn-primary pd-x-25" v-modal-close="'delete-float-request-item-modal'"
              aria-label="Close" :disabled="disableDelete">
              <i class="icon ion-ios-close-outline"></i> Cancel
            </button>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </form>
  <div class="table-responsive bg-white pd-t-10" v-else>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Description</th>
          <th width="20%">Quantity</th>
          <th width="25%">Cost</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in floatRequest.items" :key="`item-${index}`">
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.cost }}</td>
          <td>{{ { value: item.cost * item.quantity } | toMoney }}</td>
        </tr>
        <tr v-if="floatRequest.items.length > 0">
          <td colspan="2" rowspan="4" class="valign-middle"></td>
          <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
            Total
          </td>
          <td colspan="1">
            <h4 class="tx-primary tx-bold tx-lato">
              {{ { value: total } | toMoney }}
            </h4>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  computed: {
    total() {
      return this.editedFloatRequest.items.reduce(
        (total, item) => total + item.cost * item.quantity,
        0
      );
    }
  },
  created() {
    this.setEditedFloatRequest(this.floatRequest);
  },
  data: () => ({
    editedFloatRequest: {
      description: null,
      file: null,
      file_name: "Select File",
      items: []
    },
    disabled: false,
    disableDelete: false,
    itemToDelete: null,
    itemToDeleteIndex: null,
    validationErrors: {}
  }),
  methods: {
    add1Item() {
      this.editedFloatRequest.items.push({
        description: null,
        quantity: null,
        cost: null
      });
    },
    async deleteItem() {
      if (!this.itemToDelete.id) {
        this.editedFloatRequest.items.splice(this.itemToDeleteIndex, 1);
        this.closeModal("delete-float-request-item-modal");
        return true;
      }

      this.disableDelete = true;

      try {
        const response = await this.$axios.delete(
          "float-request-items/" + this.itemToDelete.id
        );
        this.disableDelete = false;
        this.editedFloatRequest.items.splice(this.itemToDeleteIndex, 1);
        this.$emit("update");
        this.closeModal("delete-float-request-item-modal");
      } catch (error) {
        this.disableDelete = false;
        console.log(error);
      }
    },
    setEditedFloatRequest(floatRequest) {
      var { description, items } = floatRequest;
      items = items.map((item) => Object.assign({}, item));

      this.editedFloatRequest = Object.assign(
        { ...this.editedFloatRequest },
        { description, items }
      );
      if (this.editedFloatRequest.items.length < 1) this.add1Item();
    },
    async updateFloatRequest() {
      if (!this.validateForm("float-request-items-form")) return false;

      this.disabled = true;

      const float_request_id = this.floatRequest.id;
      const item_description = this.editedFloatRequest.items.map(
        (item) => item.description
      );
      const item_quantity = this.editedFloatRequest.items.map(
        (item) => item.quantity
      );
      const item_cost = this.editedFloatRequest.items.map((item) => item.cost);

      try {
        const response = await this.$axios.put(
          `float-requests/${this.floatRequest.id}`,
          {
            ...this.editedFloatRequest,
            item_description,
            item_cost,
            item_quantity
          }
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
  middleware: ["auth"],
  mixins: [authMixin, formMixin, modalMixin],
  props: ["floatRequest"],
  watch: {
    floatRequest(val) {
      this.setEditedFloatRequest(val);
    }
  }
};
</script>
