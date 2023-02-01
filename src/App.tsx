import React, { useCallback, useEffect, useState } from "react";
import FileDropzone from "./components/FileDropzone/FileDropzone";
import Loader from "./components/Loader/Loader";
import {
  Button,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ILog, parse } from "./utils/logFileParser";
import { LogView } from "./components/LogView/LogView";
import Box from "@mui/material/Box";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [logs, setLogs] = useState<ILog[]>([]);
  const [filter, setFilter] = useState("");

  const handleUploadFile = (files: File[]) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onerror = () => {
      // todo Error message
      setError("error");
      setLoading(false);
    };
    reader.onload = (event) => {
      if (event.target?.result) {
        const rows = (event.target.result as string).split("\n");
        setFileContent(rows);
        parse(rows)
          .then((res) => setLogs(res))
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
      } else {
        setError("Empty read result");
      }
    };

    reader.readAsText(files[0]);
  };

  const handleReset = () => {
    setError("");
    setLogs([]);
    setFileContent([]);
  };

  const filterLogs = useCallback(
    (value: string) => {
      const filtered = fileContent.filter((row) => row.includes(value));
      parse(filtered)
        .then((res) => setLogs(res))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    },
    [fileContent]
  );

  useEffect(() => {
    filterLogs(filter);
  }, [filter, filterLogs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 2 }}>
        {fileContent && !loading && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <TextField
              size="small"
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outlined" color="error" onClick={handleReset}>
              Clear
            </Button>
          </Box>
        )}
        {fileContent.length > 0 && logs.length > 0 && !loading && (
          <LogView logs={logs} />
        )}
        {fileContent.length === 0 && <FileDropzone onLoad={handleUploadFile} />}
        {loading && <Loader />}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </ThemeProvider>
  );
}

export default App;
