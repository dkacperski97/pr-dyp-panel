import React, { useEffect, useState, useRef } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Toolbar from "./components/NewComponents";
import SiteConfig from "../../types/site";
import ListSubheader from "@material-ui/core/ListSubheader";
import Viewer from "./components/Viewer";
import Header from "./components/Header";
import Pages from "./components/Pages";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import Editor from "../../types/editor";
import { useScreenshot } from "use-react-screenshot";
import Layout from "./components/Layout";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import PageHeader from "./components/PageHeader";
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';
import ComponentConfigurator from "./components/ComponentConfigurator";

const UPDATE_SITE = gql`
    mutation ($value: String) {
        site(value: $value)
    }
`;
const GENERATE = gql`
    mutation ($id: String) {
        generate(id: $id)
    }
`;
const GET_FIRST_SITE = gql`
    query {
        firstSite
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
        },
        sub: {
            width: drawerWidth,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "absolute",
            backgroundColor: theme.palette.background.paper,
        },
        sub1: {
            zIndex: 1
        },
        sub2: {
            zIndex: 2
        },
        drawerPaper: {
            width: drawerWidth,
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "thin",
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
        info: {
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
        }
    })
);


const PagesEditor: React.FC = () => {
    const classes = useStyles();
    const client = useApolloClient();
    const ref = useRef<HTMLElement>(null);
    const [image, takeScreenshot] = useScreenshot();
    const [site, setSite] = useState<SiteConfig>();
    const [editor, setEditor] = useState<Editor>(new Editor());
    const [generate, { loading }] = useMutation(GENERATE, {
        variables: { id: site?.id }
    });
    const [update, { loading: loading2 }] = useMutation(UPDATE_SITE, {
        variables: { value: JSON.stringify(site) },
    });
    useEffect(() => {
        if (!site) {
            client.query<{ firstSite: string }>({ query: GET_FIRST_SITE }).then(res => {
                const { data } = res;
                console.log(data)
                let s;
                try {
                    s = JSON.parse(data.firstSite) as SiteConfig;
                } catch (e) {
                    console.log(e)
                    return;
                }
                console.log(s)
                setSite(s);
            })
        }
    }, [site, setSite])
    useEffect(() => {
        // const pageCount = site.components.filter((c) => c.templateId === "page").length;
        if (site) {
            const start = new Date();
            console.log('start', start.getSeconds(), start.getMilliseconds())
            update().then(() => {
                console.log('end', start.getSeconds(), start.getMilliseconds())
                if (editor.activePage !== undefined) {
                    // if(!site.components.some(c => c.variables.some(v => v.templateParameters === undefined))) {
                        console.log('generate', JSON.parse(JSON.stringify(site)))
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
                    // }
                }
            })
        }
    }, [site]);

    if (!site) {
        return null;
    }

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
                {/* { !editor.showLayout ? ( */}
                    <div className={classes.sub + " " + classes.sub1}>
                        <Header site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
                        <Pages site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
                    </div>
                {/* ) : ( */}
                <Slide in={editor.showLayout === true} direction="up"> 
                    <div className={classes.sub + " " + classes.sub2}>
                    {editor.showLayout === true && (
                        <>
                            <PageHeader site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
                            <Layout site={site} setSite={setSite} editor={editor} setEditor={setEditor} />
                            <Divider />
                            <List
                                className={classes.componentsList}
                                subheader={
                                    <ListSubheader className={classes.listSubheader} component="div">
                                        Add a new component
                                    </ListSubheader>
                                }
                            >
                                <Toolbar />
                            </List>
                        </>
                    )}
                    </div>
                </Slide>
                {/* )} */}
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
                {editor.activeComponent ? (
                    <ComponentConfigurator
                        id={editor.activeComponent}
                        site={site}
                        setSite={setSite}
                    />
                ) : (
                    <div></div>
                    // <Typography className={classes.info}>Select a page or create a new one.</Typography>
                )}
            </Drawer>
        </div>
    );
};

export default PagesEditor;
