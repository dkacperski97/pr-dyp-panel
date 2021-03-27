import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';

const components = [
    "None",
    "Atria",
    "Callisto",
    "Dione",
    "Ganymede",
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
    })
);

const Toolbar: React.FC = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <List>
                {components.map((component) => (
                    <ListItem button key={component}>
                        <ListItemText primary={component} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default Toolbar;
