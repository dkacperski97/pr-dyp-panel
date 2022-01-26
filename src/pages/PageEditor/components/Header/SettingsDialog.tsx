import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import SiteConfig from "../../../../types/site";


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

type SettingsDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, setOpen, site, setSite }) => {
    const classes = useStyles();
    const [uri, setUri] = React.useState('');

    React.useEffect(() => {
        if (site) {
            const apolloClient = site.variables.find(v => v.templateId === 'apolloClient');
            console.log(apolloClient)
            setUri(apolloClient?.templateParameters?.uri || "")
        }
    }, [site])

    const onSaveClick = () => { 
        setSite((prev) => ({ ...prev, variables: prev.variables.map(v => v.templateId === 'apolloClient' ? { ...v, templateParameters: { ...v.templateParameters, uri: uri } } : v) }));
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUri(event.target.value as string);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent className={classes.form}>
                <TextField
                    id="uri"
                    label="Apollo Client URI"
                    type="text"
                    value={uri}
                    onChange={handleUriChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button  onClick={onSaveClick} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;
