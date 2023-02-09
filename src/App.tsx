import React, { useCallback, useState } from "react";
import FileDropzone from "./components/FileDropzone/FileDropzone";
import Loader from "./components/Loader/Loader";
import {
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ILog, parse } from "./utils/logFileParser";
import { LogView } from "./components/LogView/LogView";
import Box from "@mui/material/Box";
import { Filter } from "./components/Filter/Filter";

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
    async (value: string) => {
      setLoading(true);
      const filtered = fileContent.filter((row) => row.includes(value));
      const parsedLogs = await parse(filtered);
      setLogs(parsedLogs);
      setLoading(false);
    },
    [fileContent]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 2 }}>
        {fileContent && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Filter onFilter={filterLogs} onInput={() => setLoading(true)} />
            <Button variant="outlined" color="error" onClick={handleReset}>
              Clear
            </Button>
          </Box>
        )}
        {fileContent.length > 0 && logs.length > 0 && !loading && (
          <LogView logs={logs} />
        )}
        {fileContent.length === 0 && !loading && (
          <FileDropzone onLoad={handleUploadFile} />
        )}
        {loading && <Loader />}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </ThemeProvider>
  );
}

export default App;
