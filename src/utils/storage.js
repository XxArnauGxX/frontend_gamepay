const storage = {
  create(key, data) {
    if (!key || data == null) {
      console.error("Error: key or data is null or undefined");
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log("Successfully added to localStorage");
      return true;
    } catch (e) {
      console.log({ error: e.message });
      return false;
    }
  },
  get(key) {
    if (!key) {
      console.error("Error: key is null or undefined");
      return false;
    }
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        console.error("Key does not exist");
        return null;
      }
      return JSON.parse(item);
    } catch (e) {
      console.log({ error: e.message });
      return false;
    }
  },
  update(key, data) {
    if (!key || data == null) {
      console.error("Error: key or data is null or undefined");
      return false;
    }
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        console.error("Key does not exist");
        return null;
      }
      localStorage.setItem(key, JSON.stringify(data));
      console.log("Successfully updated to localStorage");
      return true;
    } catch (e) {
      console.log({ error: e.message });
      return false;
    }
  },
  remove(key) {
    if (!key) {
      console.error("Error: key is null or undefined");
      return false;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.log({ error: e.message });
      return false;
    }
  },
};

export default storage;
