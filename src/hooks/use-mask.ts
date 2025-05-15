const useMask = {
  creditCard: () => {
    let oldValue: string, oldCursor: number;

    const regex = new RegExp(/^\d{0,16}$/g);

    const mask = (value: string) => {
      var output: string[] = [];
      for (var i = 0; i < value.length; i++) {
        if (i !== 0 && i % 4 === 0) {
          output.push("-"); // add the separator
        }
        output.push(value[i]);
      }
      return output.join("");
    };

    const unmask = (value: any) => value.replace(new RegExp(/[^\d]/, "g"), ""); // Remove every non-digit character

    const checkSeparator = (position: any, interval: any) =>
      Math.floor(position / (interval + 1));

    const onKeyDown = ({ target }: any) => {
      oldValue = target.value;
      oldCursor = target.selectionEnd;
    };

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      var el = e.target,
        newCursorPosition,
        newValue = unmask(el.value);

      if (newValue.match(regex)) {
        newValue = mask(newValue);

        newCursorPosition =
          oldCursor -
          checkSeparator(oldCursor, 4) +
          checkSeparator(oldCursor + (newValue.length - oldValue.length), 4) +
          (unmask(newValue).length - unmask(oldValue).length);

        if (newValue !== "") {
          el.value = newValue;
        } else {
          el.value = "";
        }
      } else {
        el.value = oldValue;
        newCursorPosition = oldCursor;
      }
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    };

    return { onKeyDown, onInput };
  },

  timeHour: () => {
    //hh:mm
    let oldValue: string, oldCursor: number;

    const regex = new RegExp(/^\d{0,4}$/g);

    const mask = (value: string) => {
      var output: string[] = [];
      for (var i = 0; i < value.length; i++) {
        if (i !== 0 && i % 2 === 0) {
          output.push(":"); // add the separator
        }
        if (i === 0) {
          if (parseInt(value[0]) > 2) {
            output.unshift("0");
          }
        }
        if (i === 1) {
          if (parseInt(value[0]) > 1) {
            if (parseInt(value[1]) > 4) {
              continue;
            }
          }
        }
        if (i === 2) {
          if (parseInt(value[2]) > 5) {
            continue;
          }
        }

        output.push(value[i]);
      }
      return output.join("");
    };

    const unmask = (value: any) => value.replace(new RegExp(/[^\d]/, "g"), ""); // Remove every non-digit character

    const checkSeparator = (position: any, interval: any) =>
      Math.floor(position / (interval + 1));

    const onKeyDown = ({ target }: any) => {
      oldValue = target.value;
      oldCursor = target.selectionEnd;
    };

    const onInput = (e: any) => {
      var el = e.target,
        newCursorPosition,
        newValue = unmask(el.value);

      if (newValue.match(regex)) {
        newValue = mask(newValue);

        newCursorPosition =
          oldCursor -
          checkSeparator(oldCursor, 2) +
          checkSeparator(oldCursor + (newValue.length - oldValue.length), 2) +
          (unmask(newValue).length - unmask(oldValue).length);

        if (newValue !== "") {
          el.value = newValue;
        } else {
          el.value = "";
        }
      } else {
        el.value = oldValue;
        newCursorPosition = oldCursor;
      }
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    };

    return { onKeyDown, onInput };
  },

  phoneNumber: () => {
    let oldValue: string, oldCursor: number;

    const regex = new RegExp(/^\d{0,9}$/g);

    const mask = (value: string) => {
      var output: string[] = [];
      for (var i = 0; i < value.length; i++) {
        if (i !== 0 && i % 3 === 0) {
          output.push("-"); // add the separator
        }
        output.push(value[i]);
      }
      return output.join("");
    };

    const unmask = (value: any) => value.replace(new RegExp(/[^\d]/, "g"), ""); // Remove every non-digit character

    const checkSeparator = (position: any, interval: any) =>
      Math.floor(position / (interval + 1));

    const onKeyDown = ({ target }: any) => {
      oldValue = target.value;
      oldCursor = target.selectionEnd;
    };

    const onInput = (e: any) => {
      var el = e.target,
        newCursorPosition,
        newValue = unmask(el.value);

      if (newValue.match(regex)) {
        newValue = mask(newValue);

        newCursorPosition =
          oldCursor -
          checkSeparator(oldCursor, 3) +
          checkSeparator(oldCursor + (newValue.length - oldValue.length), 3) +
          (unmask(newValue).length - unmask(oldValue).length);

        if (newValue !== "") {
          el.value = newValue;
        } else {
          el.value = "";
        }
      } else {
        el.value = oldValue;
        newCursorPosition = oldCursor;
      }
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    };

    return { onKeyDown, onInput };
  },
};

export default useMask;
