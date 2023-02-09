import React, { FC, useCallback, useEffect, useState } from "react";
import { debounce, TextField } from "@mui/material";

export const Filter: FC<{
  onFilter: (value: string) => void;
  onInput: () => void;
}> = ({ onFilter, onInput }) => {
  const [filterValue, setFilterValue] = useState("");

  const filter = useCallback(debounce(onFilter, 300), [onFilter]);

  useEffect(() => {
    onInput();
    filter(filterValue);
  }, [filterValue, filter, onInput]);

  return (
    <TextField
      size="small"
      label="Filter"
      value={filterValue}
      onChange={(e) => setFilterValue(e.target.value)}
    />
  );
};
