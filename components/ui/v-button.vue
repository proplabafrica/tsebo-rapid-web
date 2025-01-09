<template>
  <button
    :disabled="disabled"
    :aria-disabled="disabled"
    @click.prevent="$emit('click')"
  >
    <div class="sk-three-bounce" v-if="disabled">
      <div class="sk-child sk-bounce1 bg-gray-800"></div>
      <div class="sk-child sk-bounce2 bg-gray-800"></div>
      <div class="sk-child sk-bounce3 bg-gray-800"></div>
    </div>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: ["disabled"]
};
</script>
