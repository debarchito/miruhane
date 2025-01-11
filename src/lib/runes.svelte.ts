type Settings = {
  key: string;
  value: string;
}[];

export const settings = (function () {
  let data = $state<Settings>([]);
  let prevData = data;
  let diff = $state<Settings>([]);

  return {
    get get() {
      return data;
    },
    get diff() {
      return diff;
    },
    set(newData: Settings) {
      prevData = data;
      data = newData;
      diff = data.filter((d) => !prevData.some((l) => l.key === d.key && l.value === d.value));
    },
    getKeyValue(searchKey: string) {
      const item = data.find(({ key }) => key === searchKey);
      return item ? item.value : "";
    },
  };
})();

type History = {
  id: string;
  createdAt: Date;
  userId: string;
  updatedAt: Date;
  title: string;
};

export const history = (function () {
  let data = $state<History[]>([]);

  return {
    get get() {
      return data;
    },
    add(newData: History) {
      data = [...data, newData].slice(-5).reverse();
    },
    remove(historyId: string) {
      data = data.filter(({ id }) => id !== historyId);
    },
    set(newData: History[]) {
      data = newData;
    },
  };
})();
