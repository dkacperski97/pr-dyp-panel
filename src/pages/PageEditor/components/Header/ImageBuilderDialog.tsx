import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Typography from "@material-ui/core/Typography";

const GET_IMAGE = gql`
    mutation ($tag: String, $port: Int) {
        image(tag: $tag, port: $port)
    }
`;
const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: "flex",
            flexDirection: "column",
        },
        type: {
            flexDirection: 'row'
        },
        version: {
            marginBottom: theme.spacing(1)
        }
    })
);

type ImageBuilderDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ImageBuilderDialog: React.FC<ImageBuilderDialogProps> = ({ open, setOpen }) => {
    const classes = useStyles();
    const [type, setType] = React.useState<string>("node");
    const [version, setVersion] = React.useState<string>("16-alpine");
    const [port, setPort] = React.useState(3000);
    const [getImage, { loading, error, data }] = useMutation(GET_IMAGE, {
        variables: { tag: type+":"+version, port } 
    });
    React.useEffect(() => {
        if (!loading && !error && data) {
            console.log('getImage result', data)
            const blob = b64toBlob(data.image);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-app.tar';
            a.click();
        }
    }, [data])
    const onGenerateClick = () => { 
        getImage()
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value);
        if (event.target.value === 'node') {
            setVersion("16-alpine")
        } else {
            setVersion("1.21.3-alpine")
        }
    };
    const handleVersionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setVersion(event.target.value as string);
    };
    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPort(Number(event.target.value));
    };

    const node = ["16", "16-alpine", "16-slim", "14", "14-alpine", "14-slim"];
    const nginx = ["1.21.3", "1.21.3-alpine", "1.20.1", "1.20.1-alpine"];

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Image builder</DialogTitle>
            <DialogContent className={classes.form}>
                {error && (
                    <Typography variant="h6" component="h6">
                        {error.message}
                    </Typography>
                )}
                <FormControl component="fieldset">
                    <FormLabel component="legend">Type</FormLabel>
                    <RadioGroup className={classes.type} name="type" value={type} onChange={handleTypeChange}>
                        <FormControlLabel value="node" control={<Radio />} label="Node" />
                        <FormControlLabel value="nginx" control={<Radio />} label="Nginx" />
                    </RadioGroup>
                </FormControl>
                <FormControl className={classes.version}>
                    <InputLabel htmlFor="version">Version</InputLabel>
                    <Select id="version" value={version} onChange={handleVersionChange}>
                        <MenuItem value="">
                            <em> </em>
                        </MenuItem>
                        {type === 'node' ? node.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        )) : nginx.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    id="port"
                    label="Port"
                    type="number"
                    value={port}
                    onChange={handlePortChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button  onClick={onGenerateClick} disabled={loading} color="primary">
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageBuilderDialog;
