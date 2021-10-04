import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import GetAppIcon from '@material-ui/icons/GetApp';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab';


// Generate
// Options

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
            display: "inline-block"
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

const Header = () => {
    const classes = useStyles();
    const onGenerateClick = () => {};
    const onOptionsClick = () => {};

    return (
        <AppBar position="static" color="inherit">
            <Toolbar className={classes.toolbar}>
                <div className={classes.titleContainer}>
                    <Typography variant="h5" component="h1" className={classes.title}>
                        Editor
                    </Typography>
                    <IconButton edge="end" onClick={onOptionsClick}>
                        <TuneIcon />
                    </IconButton>
                </div>
                <Fab className={classes.fabButton} color="secondary" size="small" onClick={onGenerateClick}>
                    <GetAppIcon />
                </Fab>
                {/* <ListItem button onClick={onNewPageClick}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="New page" />
                </ListItem> */}
            </Toolbar>
        </AppBar>
    );
}

export default Header;