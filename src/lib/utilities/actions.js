export const clickAway = (element, callback) => {
  const onClick = (event) => {
    if (typeof callback === "function" && !element.contains(event.target)) {
      callback();
    }
  };
  document.body.addEventListener("mousedown", onClick);

  return {
    update(newCallback) {
      callback = newCallback;
    },
    destroy() {
      document.body.removeEventListener("mousedown", onClick);
    }
  };
};
