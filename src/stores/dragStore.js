// stores/dragStore.js
import { defineStore } from "pinia";

export const useDragStore = defineStore("dragStore", {
  state: () => ({
    draggedIndex: null,
    toDraggedIndex: null,
    draggedObj: null,
  }),
  getters: {
    getDraggedIndex(state) {
      return state.draggedIndex;
    },
    getToDraggedIndex(state) {
      return state.toDraggedIndex;
    },
    getDraggedObj(state) {
      return state.draggedObj;
    },
  },
  actions: {
    setDraggedIndex(index) {
      this.draggedIndex = index;
    },
    setToDraggedIndex(index) {
      this.toDraggedIndex = index;
    },
    setDraggedObj(obj) {
      this.draggedObj = obj;
    },
    clearStore() {
      this.draggedIndex = null;
      this.toDraggedIndex = null;
      this.draggedObj = null;
    },
  },
});
