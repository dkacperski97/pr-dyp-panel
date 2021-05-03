import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Toolbar from "./components/Toolbar";
import Page from "../../types/page";
import Layout from "../../types/layout";
import ComponentContainer from "./components/ComponentContainer";
import { gql, useMutation } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import BuildIcon from '@material-ui/icons/Build';
import ListSubheader from '@material-ui/core/ListSubheader';
import AddIcon from '@material-ui/icons/Add';

const GENERATE = gql`
    mutation {
        generate
    }
`;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        // toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    })
);

const PagesEditor: React.FC = () => {
    const classes = useStyles();
    const [generate, { loading }] = useMutation(GENERATE);
    const [page, setPage] = useState<Page>({
        uniqueName: "",
        inputs: [],
        layout: [new Layout("main")],
    });
    const mainId = page.layout.find((component) => component.componentId === "main")!.id;
    const setLayout = (layout: (prev: Layout[]) => Layout[]) =>
        setPage((prev) => ({ ...prev, layout: layout(prev.layout) }));
    const onGenerateClick = () => {
        generate();
    };
    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <List>
                    <ListItem>
                        <Typography variant="h4" component="h1">
                            Editor
                        </Typography>
                    </ListItem>
                </List>
                <List
                    subheader={
                        <ListSubheader component="div">
                        Pages
                        </ListSubheader>
                    }
                >
                    {["Page 1", "Page 2", "Page 3", "Page 4"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <List
                    subheader={
                        <ListSubheader component="div">
                        Actions
                        </ListSubheader>
                    }
                >
                    <ListItem button>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="New page" />
                    </ListItem>
                    <ListItem button disabled={loading} onClick={onGenerateClick}>
                        <ListItemIcon>
                            <BuildIcon />
                        </ListItemIcon>
                        <ListItemText primary={loading ? 'Generating...' : 'Generate'} />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <ComponentContainer id={mainId} layout={page.layout} setLayout={setLayout} />
            </main>
            <Toolbar />
        </div>
    );
};

export default PagesEditor;
