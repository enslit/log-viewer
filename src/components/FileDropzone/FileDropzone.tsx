import React, { useCallback, useState } from "react";
import { FileError, FileRejection, useDropzone } from "react-dropzone";
import { List, ListItem, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  height: "100%",
}));

const DropZoneWrapper = styled("div")(({ theme }) => ({
  border: "2px dashed " + theme.palette.grey.A700,
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(5),
  textAlign: "center",
  cursor: "pointer",
  transition: `all 200ms ease-in-out`,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",

  "&:hover": {
    borderColor: theme.palette.common.white,
  },
}));

interface Props {
  onLoad: (files: File[]) => void;
  acceptMimeTypesMessage?: string;
}

const FileDropzone = ({
  onLoad,
  acceptMimeTypesMessage,
}: Props): JSX.Element => {
  const [errors, setErrors] = useState<FileError[]>([]);

  const onError = useCallback((errors: FileError[]) => {
    console.error("Ошибка загрузки файла", errors);
    setErrors(errors);
  }, []);

  const handlerImportFile = useCallback(
    (files: File[]): void => {
      if (files.length > 0) {
        onLoad(files);
      }
    },
    [onLoad]
  );

  const handlerRejectedFile = useCallback(
    (fileRejections: FileRejection[]): void => {
      if (fileRejections.length > 0) {
        onError(fileRejections[0].errors);
      }
    },
    [onError]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: handlerImportFile,
    onDropRejected: handlerRejectedFile,
    maxFiles: 1,
  });

  return (
    <StyledPaper>
      {errors.length > 0 && (
        <List>
          {errors.map((error) => (
            <ListItem key={error.message}>{error.message}</ListItem>
          ))}
        </List>
      )}
      <DropZoneWrapper {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography variant="body1" component="div">
          Перетащите файлы в эту зону или кликните для выбора файла
        </Typography>
        {acceptMimeTypesMessage && (
          <Typography variant="caption" component="em">
            ({acceptMimeTypesMessage})
          </Typography>
        )}
      </DropZoneWrapper>
    </StyledPaper>
  );
};

export default FileDropzone;
