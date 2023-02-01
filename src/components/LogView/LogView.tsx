import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ILog } from "../../utils/logFileParser";
import { Palette } from "@mui/material";

interface LogViewProps {
  logs: ILog[];
}

export const LogView: FC<LogViewProps> = ({ logs }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Level</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <Log key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const paletteLogsLevel: Partial<Record<string, keyof Palette>> = {
  info: "info",
  error: "error",
  warning: "warning",
  debug: "info",
};

const Log: FC<{ log: ILog }> = ({ log }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <TableRow
        hover
        sx={{
          "& > *": { borderBottom: "unset" },
          "&:hover": { cursor: "pointer" },
        }}
        onClick={toggleOpen}
      >
        <TableCell>
          {log?.data ? (
            open ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          ) : (
            <></>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          <Box
            component="span"
            sx={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "5px",
              color: "common.white",
              backgroundColor: `${paletteLogsLevel[log.level]}.light`,
            }}
          >
            {log.level}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{log.logDate}</TableCell>
        <TableCell>{log.message}</TableCell>
      </TableRow>
      {log?.data && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <pre>{JSON.stringify(log.data, null, 4)}</pre>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
