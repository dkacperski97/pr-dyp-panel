import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import components from "components";
import { useDrag } from "react-dnd";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
    })
);

type ToolbarItemProps = {
    component: any;
};
const ToolbarItem: React.FC<ToolbarItemProps> = ({ component }) => {
    const [collected, drag] = useDrag(
        () => ({
            type: "component",
            item: { id: component.id },
        }),
        []
    );

    return (
            <ListItem ref={drag} button {...collected}>
                <ListItemText primary={component.id} />
            </ListItem>
    );
};

const Toolbar: React.FC = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <List>
                {components.map((component: any) => (
                    <ToolbarItem key={component.id} component={component} />
                ))}
            </List>
        </Paper>
    );
};

export default Toolbar;
