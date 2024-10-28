class DragStore {
    static draggedIndex = null;
    static toDraggedIndex = null;
    static draggedObj = null;

    getDraggedIndex() {
        return DragStore.draggedIndex;
    }

    setDraggedIndex(index) {
        DragStore.draggedIndex = index;
    }

    getToDraggedIndex() {
        return DragStore.toDraggedIndex;
    }

    setToDraggedIndex(index) {
        DragStore.toDraggedIndex = index;
    }

    getDraggedObj() {
        return DragStore.draggedObj;
    }

    setDraggedObj(obj) {
        DragStore.draggedObj = obj;
    }

    clearStore() {
        DragStore.toDraggedIndex = null;
        DragStore.draggedObj = null;
        DragStore.draggedIndex = null;
    }
}


export default DragStore;