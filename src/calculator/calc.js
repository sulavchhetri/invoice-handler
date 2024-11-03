import { reactive } from "vue";

class CalcStore {
  constructor() {
    this.state = reactive({
      amounts: {},
      hours: {},
      discounts: {},
    });

    this.mappers = {
      amount: this.state.amounts,
      hours: this.state.hours,
      discount: this.state.discounts,
    };

    this.keys = ["amount", "hours", "unit_price", "discount", "task", "task_id"];
  }

  setAmounts(data) {
    Object.assign(this.state.amounts, data);
  }

  setHours(data) {
    Object.assign(this.state.hours, data);
  }

  setDiscounts(data) {
    Object.assign(this.state.discounts, data);
  }

  getAmount(key) {
    return this.state.amounts[key];
  }

  getDiscount(key) {
    return this.state.discounts[key];
  }

  getHours(key) {
    return this.state.hours[key];
  }

  removeKeyFromDiscarded(keyToRemove) {
    return this.keys.filter((key) => key !== keyToRemove);
  }

  setTotal(obj, extractKey) {
    const discardedKeys = this.removeKeyFromDiscarded(extractKey);
    let sum = 0;
    for (const [key, value] of Object.entries(obj)) {
      if (key === extractKey) {
        sum += value;
      } else if (!discardedKeys.includes(key)) {
        const nestedSum = this.setTotal(value, extractKey);
        this.mappers[extractKey][key] = nestedSum;
        sum += nestedSum;
      }
    }
    return sum;
  }

  clearStore() {
    this.state.amounts = {};
    this.state.discounts = {};
    this.state.hours = {};
  }
}

export const calcStore = new CalcStore();
