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
  };
})();
