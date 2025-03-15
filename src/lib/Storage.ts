export default {
  get: (key: string) => {
    const data = localStorage.getItem(`@${key}`);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (e instanceof SyntaxError) {
          return data;
        }
      }
    }
  },

  set: (key: string, value: any) => {
    const oldValue = localStorage.getItem(`@${key}`);
    const data = localStorage.setItem(
      `@${key}`,
      typeof value == "object" ? JSON.stringify(value) : value
    );

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `@${key}`,
        newValue: value,
        oldValue: oldValue,
      })
    );
    return data;
  },

  remove: (key: string) => {
    return localStorage.removeItem(`@${key}`);
  },
};
