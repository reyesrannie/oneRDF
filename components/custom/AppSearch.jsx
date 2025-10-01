import { Box, IconButton, InputBase } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "../styles/AppSearch.scss";

const AppSearch = ({ onSearch }) => {
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  const getValue = useCallback((e) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onSearch(e?.target?.value);
    }, 500);
  }, []);

  return (
    <Box
      display={"flex"}
      bgcolor={"background.paper"}
      alignItems={"center"}
      sx={{
        border: "1px solid #A0A0A0",
        padding: 0.5,
        maxHeight: "20px",
        borderRadius: 1,
      }}
    >
      <InputBase
        sx={{
          color: "#000000",
          fontSize: "12px",
        }}
        inputRef={inputRef}
        onKeyUp={(e) => getValue(e)}
        placeholder="Search..."
      />
    </Box>
  );
};

export default AppSearch;
