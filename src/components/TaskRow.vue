<template>
  <div class="table-container" v-if="hasData(tableData)" :style="rowStyle">
    <div class="table-row">
      <div class="table-cell first-table-cell" 
        @dragstart="onDragStart(tableId)" 
        @dragover.prevent
        @drop="onDrop(tableId, true)" draggable="true">
        <span class="icon">☰</span>
      </div>
      <div class="table-cell" 
        @dragover.prevent 
        @drop="onDrop(tableId)">{{ tableData.Task }}</div>
      <div class="table-cell" 
        @dragover.prevent 
        @drop="onDrop(tableId)">{{ tableData['Man-hours'] }} <p
          v-if="hasChildren(tableData)">[{{ hours }}]</p>
      </div>
      <div class="table-cell" 
        @dragover.prevent 
        @drop="onDrop(tableId)">{{ tableData.UnitPrice }}</div>
      <div class="table-cell" 
        @dragover.prevent 
        @drop="onDrop(tableId)">{{ tableData.Discount }} <p
          v-if="hasChildren(tableData)">[{{ discount }}]</p>
      </div>
      <div class="table-cell" 
        @dragover.prevent 
        @drop="onDrop(tableId)">{{ tableData.Amount }} <p
          v-if="hasChildren(tableData)">[{{ amount }}]</p>
      </div>
    </div>
    <template v-if="hasChildren(tableData)">
      <TaskRow 
        v-for="(row, index) in extractExtraKeys(tableData)" 
        :key="index" 
        :table-id="index" 
        :table-data="row"
        :root="root" 
        @refresh-table-data="refreshTableData" />
    </template>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import TaskRow from './TaskRow.vue';
import { dragStore } from '../utils.js';


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
  }
})

const emits = defineEmits(['update-table-data', 'refresh-table-data'])

const rootData = ref({})

const hours = computed(() => calculateTotal(props.tableData, 'Man-hours'))
const amount = computed(() => calculateTotal(props.tableData, 'Amount'))
const discount = computed(() => calculateTotal(props.tableData, 'Discount'))


const oldKey = ref(null);

function hasData(obj) {
  return Object.keys(obj).length > 0;
}

const hasChildren = (obj) => {
  const standardKeys = ['Task', 'Man-hours', 'UnitPrice', 'Discount', 'Amount'];
  return Object.keys(obj).some(key => !standardKeys.includes(key));
};

const extractExtraKeys = (obj) => {
  const allowedKeys = ['Task', 'Man-hours', 'UnitPrice', 'Discount', 'Amount'];
  const extraKeys = {};

  for (const key in obj) {
    if (!allowedKeys.includes(key)) {
      extraKeys[key] = obj[key];
    }
  }

  return extraKeys;
};

const dotCount = props.tableId.split('.').length - 1;

const rowStyle = {
  paddingLeft: `${dotCount * 20}px`
};


const refreshTableData = (data) => {
  emits('refresh-table-data', data);
}

const calculateTotal = (data, property) => {
  let total = 0;
  if (property && data[property]) {
    total += data[property];
  }
  for (const key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      total += calculateTotal(data[key], property);
    }
  }
  return total;
};


const onDragStart = (index) => {
  if (dragStore.getDraggedIndex === null) {
    dragStore.setDraggedIndex(index);
  }
}

const onDrop = (targetId, sibling = false) => {
  try {
    if (dragStore.toDraggedIndex === null && checkPossibility(dragStore.getDraggedIndex, targetId)) {
      dragStore.setToDraggedIndex(targetId);
      const draggedKeys = versionParts(dragStore.getDraggedIndex)
      const toDragKeys = versionParts(dragStore.getToDraggedIndex)
      rootData.value = manipulateObj(props.root, 'del', draggedKeys, null)
      rootData.value = manipulateObj(rootData.value, 'set', toDragKeys, dragStore.getDraggedObj, draggedKeys.length > toDragKeys.length, sibling)
      emits('refresh-table-data', rootData.value)
    }
  }
  catch (error) {
    console.log(error)
  }

};

function versionParts(version) {
  const parts = version.split('.');
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts.slice(0, i + 1).join('.'));
  }
  return result;
}

const getNewKey = (keys, index, checkObj) => {
  let baseKey = keys[index]
  const parts = baseKey.split('.');
  let lastSegment = parts.pop();
  let n = parseInt(lastSegment) || 1;
  let newKey = parts.length ? `${parts.join('.')}.${n + 1}` : `${n + 1}`;
  while (true) {
    if (checkObj[newKey] === undefined) {
      break;
    }
    n++;
    newKey = parts.length ? `${parts.join('.')}.${n + 1}` : `${n + 1}`;
  }
  return newKey;
}

const getNestedNewKey = (keys, index, checkObj) => {
  let baseKey = keys[index]
  let n = 1
  let newKey = `${baseKey}.${n}`
  while (true) {
    if (checkObj[newKey] === undefined) {
      break;
    }
    n++;
    newKey = `${baseKey}.${n}`
  }
  return newKey;
}



function manipulateObj(obj, action, keys, item, fromInside = false, sibling) {
  let current = obj;
  let lastCurrentObj = obj;
  let nextCurrentObj = obj;
  let newKey;
  let checkObj;
  for (let i = 0; i < keys.length; i++) {
    nextCurrentObj = current[keys[i]];
    if (i === keys.length - 1) {
      if (action === 'del') {
        dragStore.setDraggedObj(current[keys[i]]);
        oldKey.value = keys[i];
        delete current[keys[i]];
        return obj;
      } else if (action === 'set') {
        if (sibling) {
          checkObj = current
          newKey = getNewKey(keys, i, checkObj);
        }
        else {
          checkObj = nextCurrentObj
          newKey = getNestedNewKey(keys, i, checkObj);
        }
        checkObj[newKey] = newKey !== oldKey.value ? singleTonConvertor(item, newKey) : item;
        return obj;
      }
    } else {
      lastCurrentObj = current;
      current = current[keys[i]];
    }
  }
}

function checkPossibility(input, output) {
  const inputParts = input.split('.');
  const outputParts = output.split('.');
  if (output.startsWith(input) && output.length > input.length && output[input.length] === '.') {
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
    if (typeof obj[key] === 'object' && obj[key] !== null) {
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
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
}

.first-table-cell {
  max-width: 100px;
}

.table-row {
  display: flex;
  border: 1px solid black;
}


.table-cell {
  flex: 1;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>
