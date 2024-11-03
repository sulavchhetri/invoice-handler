<template>
  <div class="invoice-handler">
    <div class="invoice-header">
      <h1>Invoice Handler</h1>
      <div class="buttons">
        <button class="create-invoice-btn" @click="openModal">New</button>
        <button class="create-invoice-btn" @click="handleSaveInvoices">Save All</button>
      </div>
    </div>
    <div class="table-top">
      <div class="table-header">
        <div class="table-header-item">Task</div>
        <div class="table-header-item">Man-hours</div>
        <div class="table-header-item">Unit Price</div>
        <div class="table-header-item">Discount</div>
        <div class="table-header-item">Amount</div>
        <div class="table-header-item">Action</div>
      </div>
      <div class="children-container">
        <TaskRow
          v-for="(row, index) in tableData"
          :key="index"
          :table-id="index"
          :root="tableData"
          :table-data="row"
          @refresh-table-data="refreshTableData"
        />
      </div>
    </div>
    <InvoiceModal
      v-if="showInvoiceModal"
      :update-mode="false"
      :task-key="getNextRootKey()"
      @close-invoice-modal="handleInvoiceModal"
    />
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import TaskRow from "./TaskRow.vue";
import InvoiceModal from "./InvoiceModal.vue";
import {dragStore} from "../utils.js";
import {calcStore} from "../calculator/calc";
import {createInvoices, getInvoices, createInvoice} from "../services/apiService.js";
const tableData = ref({});
const showInvoiceModal = ref(false);

const openModal = () => {
  showInvoiceModal.value = true;
};

const refreshTableData = (data) => {
  dragStore.clearStore();
  tableData.value = data;
};

const setCalcData = () => {
  calcStore.setTotal(tableData.value, "amount");
  calcStore.setTotal(tableData.value, "hours");
  calcStore.setTotal(tableData.value, "discount");
};

const handleSaveInvoices = async () => {
  await createInvoices(tableData.value);
  tableData.value = await getInvoices()
}

onMounted(async () => {
  tableData.value = await getInvoices();
});

watch(
  tableData,
  () => {
    setCalcData();
  },
  { deep: true }
);

const handleInvoiceModal = async (data) => {
  showInvoiceModal.value = false;
  const task_id = data?.task_id;
  if (task_id) {
    await createInvoice(task_id, data);
    tableData.value = await getInvoices();
  }
};

const getNextRootKey = () => {
  const keys = Object.keys(tableData.value).map(Number);
  const maxKey = Math.max(...keys);
  return (maxKey + 1).toString();
};
</script>

<style scoped>
.invoice-handler {
  margin: 10px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background-color: #4b586e;
  color: white;
  border-radius: 6px;
}

.invoice-header h1 {
  margin: 0;
  font-size: 24px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.create-invoice-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-invoice-btn:hover {
  background-color: #218838; /* Darker green on hover */
}

.table-top {
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #696969;
}

.table-header {
  display: flex;
  background: #f5f5f5;
  justify-content: space-around;
  border-radius: 6px;
  padding: 5px;
  height: 30px;
  align-items: center;
}

.table-header-item {
  flex: 1;
  padding: 10px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 6px;
}

.table-header-item:hover {
  background-color: #e0e0e0;
}
</style>
