<template>
  <div class="modal">
    <div class="modal-content">
      <h2 class="modal-header">{{ modalHeader }}</h2>
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-input">
          <label for="task">Task ID :</label>
          <input type="text" v-model="formData.task_id" required />
        </div>
        <div class="form-input">
          <label for="task">Task :</label>
          <input type="text" v-model="formData.task" required />
        </div>
        <div class="form-input">
          <div class="form-input"></div>
          <label for="manHours">Man-hours :</label>
          <input type="number" v-model="formData.hours" required />
        </div>
        <div class="form-input">
          <label for="unitPrice">Unit Price :</label>
          <input type="number" v-model="formData.unit_price" required />
        </div>
        <div class="form-input">
          <label for="discount">Discount :</label>
          <input type="number" v-model="formData.discount" required />
        </div>
        <div class="form-input">
          <label for="amount">Amount :</label>
          <input type="number" v-model="formData.amount" required />
        </div>
        <div class="buttons">
          <button type="submit">{{ modalLeftButton }}</button>
          <button type="button" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  updateMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  taskKey: {
    type: String,
    required: true,
  },
  taskData : {
    type: Object,
    required: false,
    default : ()=> {}
  }
});

const emits = defineEmits(["close-invoice-modal"]);

const formData = reactive({
  task_id: props.taskKey,
  task: props.taskData?.task || "",
  hours: props.taskData?.hours || "",
  unit_price: props.taskData?.unit_price || "",
  discount: props.taskData?.discount || "",
  amount: props.taskData?.amount || "",
});

const modalHeader = computed(() =>
  props.updateMode ? "Update Invoice" : "Create New Invoice"
);

const modalLeftButton = computed(() => (props.updateMode ? "Update" : "Save"));

const close = () => {
  emits("close-invoice-modal", {});
  resetForm();
};

const resetForm = () => {
  formData.task_id = "";
  formData.amount = "";
  formData.hours = "";
  formData.discount = "";
  formData.task = "";
  formData.unit_price = "";
};

const submitForm = () => {
  emits("close-invoice-modal", formData);
  resetForm();
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-header {
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-input {
  display: flex;
  gap: 5px;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
}

h2 {
  font-size: 1.5em;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  color: #555;
  width: 100px;
  text-align: right;
}

input[type="text"],
input[type="number"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.buttons {
  display: flex;
  gap: 10px;
  padding-left: 23%;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100px;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #e53935;
}
</style>
