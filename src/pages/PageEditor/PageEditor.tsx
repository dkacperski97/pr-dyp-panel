import React, { useEffect, useState, useRef } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Toolbar from "./components/Toolbar";
import SiteConfig from "../../types/site";
import ListSubheader from "@material-ui/core/ListSubheader";
import OptionsEditor from "./components/OptionsEditor";
import VariablesEditor from "./components/VariablesEditor";
import Viewer from "./components/Viewer";
import Header from "./components/Header";
import Pages from "./components/Pages";
import { gql, useQuery, useMutation } from "@apollo/client";
import Editor from "../../types/editor";
import { useScreenshot } from "use-react-screenshot";
import Layout from "./components/Layout";

const UPDATE_SITE = gql`
    query ($value: String) {
        site(value: $value)
    }
`;
const GENERATE = gql`
    mutation {
        generate
    }
`;

const drawerWidth = 408;

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
        componentsList: {
            maxHeight: "400px",
            overflowY: "auto",
            scrollbarWidth: "thin",
        },
        listSubheader: {
            backgroundColor: theme.palette.background.paper,
        },
    })
);


const PagesEditor: React.FC = () => {
    const classes = useStyles();
    const ref = useRef<HTMLElement>(null);
    const [image, takeScreenshot] = useScreenshot();
    const [site, setSite] = useState<SiteConfig>(new SiteConfig());
    const [editor, setEditor] = useState<Editor>(new Editor());
    const [generate, { loading }] = useMutation(GENERATE);
    const { error, data, refetch } = useQuery(UPDATE_SITE, {
        variables: { value: JSON.stringify(site) },
    });
    useEffect(() => {
        // const pageCount = site.components.filter((c) => c.templateId === "page").length;
        if (editor.activePage !== undefined) {
            generate().then(() => {
                if (ref.current) {
                    console.log("takeScreenshot");
                    takeScreenshot(ref.current).then((image) => {
                        console.log("setEditor");
                        setEditor((prev) => ({
                            ...prev,
                            screenshots: { ...prev.screenshots, [editor.activePage!]: image },
                        }));
                    });
                }
            });
        }
        refetch();
    }, [site]);

    const setSelections = (id: string) => {
        setEditor((prev) => ({ ...prev, activePage: id, activeComponent: undefined }));
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
                <Header />
                <Pages site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
                <Layout site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
            </Drawer>
            <main className={classes.content} ref={ref}>
                {editor.activePage && (<Viewer site={site} editor={editor} setEditor={setEditor} />)}
            </main>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
            >
                <List
                    className={classes.componentsList}
                    subheader={
                        <ListSubheader className={classes.listSubheader} component="div">
                            Add component
                        </ListSubheader>
                    }
                >
                    <Toolbar />
                </List>
                {editor.activeComponent && (
                    <>
                        <VariablesEditor
                            id={editor.activeComponent}
                            site={site}
                            setSite={setSite}
                        />
                        <List subheader={<ListSubheader component="div">Options</ListSubheader>}>
                            <OptionsEditor
                                id={editor.activeComponent}
                                site={site}
                                setSite={setSite}
                            />
                        </List>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default PagesEditor;
