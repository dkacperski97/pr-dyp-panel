import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import GetAppIcon from '@material-ui/icons/GetApp';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab';
import SiteConfig from "../../../types/site";
import Editor from "../../../types/editor";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            minHeight: 0,
            alignItems: "flex-start",
            flexWrap: "wrap"
        },
        titleContainer: {
            display: "flex",
            flexGrow: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            display: "inline-block",
            width: "100%"
        },
        fabButton: {
            position: 'absolute',
            zIndex: 1,
            top: 44,
            left: 0,
            right: 0,
            margin: '0 auto',
        }
    })
);

type PageHeaderProps = {
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
};
const PageHeader: React.FC<PageHeaderProps> = ({ site, setSite, editor, setEditor }) => {
    const classes = useStyles();
    const onBackClick = () => {
        setEditor((prev) => ({ ...prev, showLayout: false }))
    };

    return (
        <AppBar position="static" color="inherit">
            <Toolbar className={classes.toolbar}>
                <div className={classes.titleContainer}>
                    <IconButton edge="start" onClick={onBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" component="h1" className={classes.title}>
                        {site.components.find(c => c.id === editor.activePage)?.name}
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default PageHeader
