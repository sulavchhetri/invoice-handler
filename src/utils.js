class DragStore {
    constructor() {
        this.draggedIndex = null;
        this.toDraggedIndex = null;
        this.draggedObj = null;
    }

    get getDraggedIndex() {
        return this.draggedIndex;
    }

    get getToDraggedIndex() {
        return this.toDraggedIndex;
    }

    get getDraggedObj() {
        return this.draggedObj;
    }

    setDraggedIndex(index) {
        this.draggedIndex = index;
    }

    setToDraggedIndex(index) {
        this.toDraggedIndex = index;
    }

    setDraggedObj(obj) {
        this.draggedObj = obj;
    }

    clearStore() {
        this.draggedIndex = null;
        this.toDraggedIndex = null;
        this.draggedObj = null;
    }
}

export const dragStore = new DragStore();
