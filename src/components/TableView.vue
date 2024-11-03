<template>
  <div class="invoice-handler">
    <div class="invoice-header">
      <h1>Invoice Handler</h1>
      <button class="create-invoice-btn" @click="openModal">New +</button>
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
import { ref, onMounted, watch } from "vue";
import TaskRow from "./TaskRow.vue";
import InvoiceModal from "./InvoiceModal.vue";
import { dragStore } from "../utils.js";
import { calcStore } from "../calculator/calc";

const tableData = ref({
  1: {
    task: "Task 1",
    hours: 40,
    unit_price: 150,
    discount: 20,
    amount: 3000,
    1.1: {
      task: "Task 1.1",
      hours: 60,
      unit_price: 20,
      discount: 10,
      amount: 2000,
    },
    1.2: {
      task: "Task 1.2",
      hours: 120,
      unit_price: 30,
      discount: 50,
      amount: 1000,
    },
  },
  2: {
    task: "Task 2",
    hours: 30,
    unit_price: 300,
    discount: 25,
    amount: 500,
  },
  3: {
    task: "Task 3",
    hours: 100,
    unit_price: 25,
    discount: 15,
    amount: 100,
  },
  4: {
    task: "Task 4",
    hours: 8,
    unit_price: 600,
    discount: 1000,
    amount: 1500,
  },
  5: {
    task: "Task 5",
    hours: 100,
    unit_price: 500,
    discount: 2500,
    amount: 2000,
  },
  6: {
    task: "Task 6",
    hours: 60,
    unit_price: 150,
    discount: 300,
    amount: 3000,
    6.1: {
      task: "Task 6.1",
      hours: 70,
      unit_price: 150,
      discount: 300,
      amount: 2000,
      "6.1.1": {
        task: "Task 6.1.1",
        hours: 50,
        unit_price: 150,
        discount: 200,
        amount: 1000,
      },
    },
  },
});

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

onMounted(() => {
  setCalcData();
});

watch(
  tableData,
  () => {
    setCalcData();
  },
  { deep: true }
);

const handleInvoiceModal = (data) => {
  showInvoiceModal.value = false;
  console.log(data, "came here");
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
  background-color: #4b586e; /* Slightly lighter than #36454f */
  color: white;
  border-radius: 6px;
}

.invoice-header h1 {
  margin: 0;
  font-size: 24px;
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
