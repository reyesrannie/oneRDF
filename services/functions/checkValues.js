import React from "react";

export const checkValues = (values = []) => {
  return Object.keys(values).every(
    (key) =>
      values[key] !== "" && values[key] !== null && values[key]?.length !== 0,
  );
};

export const filterValues = (value, data = [], filterWith) => {
  const filterData = data?.filter(
    (items) => value?.code === items[filterWith]?.code,
  );
  return filterData || [];
};

export const filterMultipleValues = (
  value,
  data = [],
  filterWith,
  getValueFrom,
) => {
  const filterData = data?.filter((item) =>
    item[filterWith]?.some((fil) => fil[getValueFrom]?.code === value?.code),
  );

  return filterData || [];
};

export const filterNavigationByAccess = (navItems, accessPermission) => {
  const parentCheck = navItems?.filter((items) =>
    items?.permission?.some((p) => accessPermission?.includes(p)),
  );

  const filterChild = parentCheck?.map((item) => {
    if (item?.children) {
      const filteredChildren = item.children.filter((child) =>
        child?.permission?.some((p) => accessPermission?.includes(p)),
      );
      return { ...item, children: filteredChildren };
    }
    return item;
  });

  return filterChild || [];
};

export const checkObject = (data) => {
  const obj = JSON.parse(data);
  return obj[0];
};

export const preventEnterKey = (e) => {
  if (e.key === "e") {
    e.preventDefault();
  }
};

export const openFileSelect = (
  setValue,
  dispatch,
  setImage,
  enqueueSnackbar,
  setImageData,
  value,
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".png, .svg";
  input.style.display = "none";
  input.onchange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/png", "image/svg+xml"];

      if (allowedTypes.includes(file.type)) {
        const sanitizedFileName = file.name.replace(/\s+/g, "_");
        const renamedFile = new File([file], sanitizedFileName, {
          type: file.type,
        });
        setValue(value, sanitizedFileName);
        dispatch(setImageData(URL.createObjectURL(renamedFile)));
        setImage(renamedFile);
      } else {
        enqueueSnackbar("Only PNG and SVG files are allowed.", {
          variant: "error",
        });
      }
    }
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};
