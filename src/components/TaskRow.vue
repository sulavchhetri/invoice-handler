<template>
  <div class="table-container" v-if="hasData(tableData)">
    <div
      v-if="hasChildren(tableData)"
      class="new-table-row"
      :style="rowStyle()"
    >
      <div class="table-row">
        <div class="table-cell first-table-cell">
          <div
            :class="[toggleArrow ? 'side-arrow' : 'down-arrow']"
            @click="toggleArrow = !toggleArrow"
          ></div>
          <div
            class="table-cell-name"
            @dragover.prevent
            @drop="onDrop(tableId)"
          >
            Parent {{ tableId }}
          </div>
        </div>
        <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
          {{ hours }}
        </div>
        <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
          --
        </div>
        <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
          {{ discount }}
        </div>
        <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
          {{ amount }}
        </div>
        <div class="table-cell">--</div>
      </div>
    </div>

    <div v-if="toggleArrow" class="table-row" :style="rowStyle()">
      <div class="table-cell first-table-cell">
        <div></div>
        <div class="name-container">
          <div
            class="drag-icon"
            @dragstart="onDragStart(tableId)"
            @dragover.prevent
            @drop="onDrop(tableId, true)"
            draggable="true"
          >
            <span class="icon">☰</span>
          </div>
          <div
            class="table-cell-name"
            @dragover.prevent
            @drop="onDrop(tableId)"
          >
            {{ tableData.task }}
          </div>
        </div>
      </div>
      <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
        {{ tableData.hours }}
      </div>
      <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
        {{ tableData.unit_price }}
      </div>
      <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
        {{ tableData.discount }}
      </div>
      <div class="table-cell" @dragover.prevent @drop="onDrop(tableId)">
        {{ tableData.amount }}
      </div>
      <div class="table-cell buttons">
        <button class="update">update</button>
        <button class="delete">delete</button>
      </div>
    </div>

    <template v-if="hasChildren(tableData) && toggleArrow">
      <TaskRow
        v-for="(row, index) in extractExtraKeys(tableData)"
        :key="index"
        :table-id="index"
        :table-data="row"
        :root="root"
        @refresh-table-data="refreshTableData"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import TaskRow from "./TaskRow.vue";
import { dragStore } from "../utils.js";
import { calcStore } from "../calculator/calc";

const props = defineProps({
  tableId: {
    type: String,
    required: true,
  },
  tableData: {
    type: Object,
    required: true,
  },
  root: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["update-table-data", "refresh-table-data"]);

const rootData = ref({});
const toggleArrow = ref(true);
const oldKey = ref(null);
const hours = computed(() => calcStore.getHours(props.tableId));
const amount = computed(() => calcStore.getAmount(props.tableId));
const discount = computed(() => calcStore.getDiscount(props.tableId));

function hasData(obj) {
  return Object.keys(obj).length > 0;
}

const hasChildren = (obj) => {
  const standardKeys = ["task", "hours", "unit_price", "discount", "amount"];
  return Object.keys(obj).some((key) => !standardKeys.includes(key));
};

const extractExtraKeys = (obj) => {
  const allowedKeys = ["task", "hours", "unit_price", "discount", "amount"];
  const extraKeys = {};

  for (const key in obj) {
    if (!allowedKeys.includes(key)) {
      extraKeys[key] = obj[key];
    }
  }

  return extraKeys;
};

const dotCount = props.tableId.split(".").length - 1;

const rowStyle = (value = null) => {
  const paddingBase = value ? value : dotCount;
  return {
    paddingLeft: `${paddingBase * 30}px`,
  };
};

const refreshTableData = (data) => {
  emits("refresh-table-data", data);
};

const onDragStart = (index) => {
  if (dragStore.getDraggedIndex === null) {
    dragStore.setDraggedIndex(index);
  }
};

const onDrop = (targetId, sibling = false) => {
  try {
    if (
      dragStore.toDraggedIndex === null &&
      checkPossibility(dragStore.getDraggedIndex, targetId)
    ) {
      dragStore.setToDraggedIndex(targetId);
      const draggedKeys = versionParts(dragStore.getDraggedIndex);
      const toDragKeys = versionParts(dragStore.getToDraggedIndex);
      rootData.value = manipulateObj(props.root, "del", draggedKeys, null);
      rootData.value = manipulateObj(
        rootData.value,
        "set",
        toDragKeys,
        dragStore.getDraggedObj,
        draggedKeys.length > toDragKeys.length,
        sibling
      );
      emits("refresh-table-data", rootData.value);
    }
  } catch (error) {
    console.log(error);
  }
};

function versionParts(version) {
  const parts = version.split(".");
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts.slice(0, i + 1).join("."));
  }
  return result;
}

const getNewKey = (keys, index, checkObj) => {
  let baseKey = keys[index];
  const parts = baseKey.split(".");
  let lastSegment = parts.pop();
  let n = parseInt(lastSegment) || 1;
  let newKey = parts.length ? `${parts.join(".")}.${n + 1}` : `${n + 1}`;
  while (true) {
    if (checkObj[newKey] === undefined) {
      break;
    }
    n++;
    newKey = parts.length ? `${parts.join(".")}.${n + 1}` : `${n + 1}`;
  }
  return newKey;
};

const getNestedNewKey = (keys, index, checkObj) => {
  let baseKey = keys[index];
  let n = 1;
  let newKey = `${baseKey}.${n}`;
  while (true) {
    if (checkObj[newKey] === undefined) {
      break;
    }
    n++;
    newKey = `${baseKey}.${n}`;
  }
  return newKey;
};

function manipulateObj(obj, action, keys, item, fromInside = false, sibling) {
  let current = obj;
  let lastCurrentObj = obj;
  let nextCurrentObj = obj;
  let newKey;
  let checkObj;
  for (let i = 0; i < keys.length; i++) {
    nextCurrentObj = current[keys[i]];
    if (i === keys.length - 1) {
      if (action === "del") {
        dragStore.setDraggedObj(current[keys[i]]);
        oldKey.value = keys[i];
        delete current[keys[i]];
        return obj;
      } else if (action === "set") {
        if (sibling) {
          checkObj = current;
          newKey = getNewKey(keys, i, checkObj);
        } else {
          checkObj = nextCurrentObj;
          newKey = getNestedNewKey(keys, i, checkObj);
        }
        checkObj[newKey] =
          newKey !== oldKey.value ? singleTonConvertor(item, newKey) : item;
        return obj;
      }
    } else {
      lastCurrentObj = current;
      current = current[keys[i]];
    }
  }
}

function checkPossibility(input, output) {
  const inputParts = input.split(".");
  const outputParts = output.split(".");
  if (
    output.startsWith(input) &&
    output.length > input.length &&
    output[input.length] === "."
  ) {
    return false;
  }

  if (inputParts.length < outputParts.length || !output.startsWith(input)) {
    return true;
  }
  return false;
}

const singleTonConvertor = (obj, targetPrefix) => {
  const extrakeysObj = extractExtraKeys(obj);
  const extrakeys = Object.keys(extrakeysObj);
  if (extrakeys.length > 0) {
    for (let index = 0; index < extrakeys.length; index++) {
      const key = extrakeys[index];
      const newKey = `${targetPrefix}.${index + 1}`;
      obj[newKey] = obj[key];
      delete obj[key];
    }
  }
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      singleTonConvertor(obj[key], `${targetPrefix}.${extrakeys.length}`);
    }
  }
  return obj;
};
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 5px;
  font-size: 16px;
  padding: 5px;
  color: #301934;
  font-weight: 500;
}

.down-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #696969;
}

.side-arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #696969;
}

.first-table-cell {
  gap: 30px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #d3d3d3;
  justify-content: space-between;
}

.table-cell {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.name-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.table-cell-name {
  color: whitesmoke;
  font-size: 13px;
  padding: 5px;
  background-color: #36454f;
  border-radius: 6px;
}

.buttons {
  display: flex;
  gap: 5px;
}

.table-cell button {
  background-color: #4b586e;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 14px;
}

.table-cell button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.table-cell button:active {
  background-color: #004085;
  transform: translateY(0);
}

.table-cell button.delete {
  background-color: #dc3545;
}

.table-cell button.delete:hover {
  background-color: #c82333;
}
</style>
