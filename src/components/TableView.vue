<template>
  <div class="table-top">
    <div class="table-header">
      <div class="table-header-item">Task</div>
      <div class="table-header-item">Man-hours</div>
      <div class="table-header-item">Unit Price</div>
      <div class="table-header-item">Discount</div>
      <div class="table-header-item">Amount</div>
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
</template>

<script setup>
import { ref } from "vue";
import TaskRow from "./TaskRow.vue";
import { dragStore } from "../utils.js";

const tableData = ref({
  1: {
    Task: "Task 1",
    "Man-hours": 40,
    UnitPrice: 150,
    Discount: 20,
    Amount: 3000,
    1.1: {
      Task: "Task 1.1",
      "Man-hours": 60,
      UnitPrice: 20,
      Discount: 10,
      Amount: 2000,
    },
    1.2: {
      Task: "Task 1.2",
      "Man-hours": 120,
      UnitPrice: 30,
      Discount: 50,
      Amount: 1000,
    },
  },
  2: {
    Task: "Task 2",
    "Man-hours": 30,
    UnitPrice: 300,
    Discount: 25,
    Amount: 500,
  },
  3: {
    Task: "Task 3",
    "Man-hours": 100,
    UnitPrice: 25,
    Discount: 15,
    Amount: 100,
  },
  4: {
    Task: "Task 4",
    "Man-hours": 8,
    UnitPrice: 600,
    Discount: 1000,
    Amount: 1500,
  },
  5: {
    Task: "Task 5",
    "Man-hours": 100,
    UnitPrice: 500,
    Discount: 2500,
    Amount: 2000,
  },
  6: {
    Task: "Task 6",
    "Man-hours": 60,
    UnitPrice: 150,
    Discount: 300,
    Amount: 3000,
    6.1: {
      Task: "Task 6.1",
      "Man-hours": 70,
      UnitPrice: 150,
      Discount: 300,
      Amount: 2000,
      "6.1.1": {
        Task: "Task 6.1.1",
        "Man-hours": 50,
        UnitPrice: 150,
        Discount: 200,
        Amount: 1000,
      },
    },
  },
});

const refreshTableData = (data) => {
  dragStore.clearStore();
  tableData.value = data;
};
</script>

<style scoped>
.table-top {
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #696969;
  width: 1500px;
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
  text-align: center;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 6px;
}

.table-header-item:hover {
  background-color: #e0e0e0;
}
</style>