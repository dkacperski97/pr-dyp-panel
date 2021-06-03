import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Toolbar from "./components/Toolbar";
import ComponentConfig from "../../types/component";
import SiteConfig from "../../types/site";
import ComponentContainer from "./components/ComponentContainer";
import { gql, useMutation, useQuery } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import ListSubheader from "@material-ui/core/ListSubheader";
import AddIcon from "@material-ui/icons/Add";
import OptionsEditor from "./components/OptionsEditor";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TuneIcon from "@material-ui/icons/Tune";
import Variable from "../../types/variable";
import { useDrop, DropTargetHookSpec } from "react-dnd";
import * as templates from "components";
import VariablesEditor from "./components/VariablesEditor";

const GENERATE = gql`
    mutation {
        generate
    }
`;
const UPDATE_SITE = gql`
    query ($value: String) {
        site(value: $value)
    }
`;

const drawerWidth = 310;

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
        },
        listSubheader: {
            backgroundColor: theme.palette.background.paper,
        },
    })
);

type ComponentListItemValueProps = {
    id: string;
    childComponent: ComponentConfig;
    depth: number;
    activeChildComponent: string | undefined;
    templateObject: any;
    onClick: () => void;
    onDeleteClick: () => void;
    setComponents: (components: (prev: ComponentConfig[]) => ComponentConfig[]) => void;
};
const ComponentListItemValue: React.FC<ComponentListItemValueProps> = ({
    id,
    depth,
    activeChildComponent,
    childComponent,
    templateObject,
    onClick,
    onDeleteClick,
    setComponents,
}) => {
    const [, drop] = useDrop(() => ({
        accept: "Common", // TODO templateObject.type,
        drop: (item: any) => {
            setComponents((prev) => {
                const newComponent = new ComponentConfig(item.id + (prev.length+1), item.id);
                return [
                    ...prev.map((c) =>
                        c.id === id ? { ...c, children: [...c.children, newComponent.id] } : c
                    ),
                    newComponent,
                ]
            });
        },
    }));

    return (
        <ListItem ref={drop} button onClick={onClick} selected={activeChildComponent === id}>
            <ListItemText primary={"_".repeat(depth) + childComponent.name} />
            {depth !== 0 && (
                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={onDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

type ComponentListItemProps = {
    id: string;
    components: ComponentConfig[];
    setComponents: (components: (prev: ComponentConfig[]) => ComponentConfig[]) => void;
    depth: number;
    activeChildComponent: string | undefined;
    setActiveChildComponent: (activeComponent: string | undefined) => void;
};
const ComponentListItem: React.FC<ComponentListItemProps> = ({
    id,
    components,
    setComponents,
    depth,
    activeChildComponent,
    setActiveChildComponent,
}) => {
    const childComponent = components.find((c) => c.id === id);
    if (!childComponent) {
        return (
            <ListItem>
                <ListItemText primary="Error" />
            </ListItem>
        );
    }
    const templateObject = templates.components.find((c) => c.id === childComponent.templateId);
    if (!templateObject) {
        return (
            <ListItem>
                <ListItemText primary="ERROR" />
            </ListItem>
        );
    }

    const onClick = () => {
        setActiveChildComponent(id);
    };

    const onDeleteClick = () => {
        const removeChildren = (newComponents: ComponentConfig[], childId: string) => {
            const index = newComponents.findIndex((c) => c.id === childId);
            newComponents[index].children.forEach((subchildId) =>
                removeChildren(newComponents, subchildId)
            );
            newComponents.splice(index, 1);
        };
        const getNewComponents = (prev: ComponentConfig[]) => {
            const newComponents = prev.slice();
            let parent = newComponents.find((c) => c.children.includes(id));
            if (parent) {
                parent.children = parent.children.filter((child) => child !== id);
            }
            removeChildren(newComponents, id);
            return newComponents;
        };
        setComponents((prev) => getNewComponents(prev));
        setActiveChildComponent(undefined);
    };

    return (
        <>
            <ComponentListItemValue
                id={id}
                depth={depth}
                activeChildComponent={activeChildComponent}
                childComponent={childComponent}
                templateObject={templateObject}
                onClick={onClick}
                onDeleteClick={onDeleteClick}
                setComponents={setComponents}
            />
            {childComponent.children.map(
                (child) =>
                    child && (
                        <ComponentListItem
                            key={child}
                            id={child}
                            components={components}
                            depth={depth + 1}
                            activeChildComponent={activeChildComponent}
                            setActiveChildComponent={setActiveChildComponent}
                            setComponents={setComponents}
                        />
                    )
            )}
        </>
    );
};

type ComponentsEditorDrawerProps = {
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
    activeComponent: string | undefined;
    setActiveComponent: (id: string) => void;
};
const ComponentsEditorDrawer: React.FC<ComponentsEditorDrawerProps> = ({
    site,
    setSite,
    activeComponent,
    setActiveComponent,
    children,
}) => {
    const classes = useStyles();
    const [generate, { loading }] = useMutation(GENERATE);

    const onGenerateClick = () => {
        generate();
    };
    const onOptionsClick = () => {};
    const onNewPageClick = () => {
        setSite((prev) => {
            const newPage = new ComponentConfig(`Page${prev.components.length + 1}`, "page");
            return {
                ...prev,
                variables: prev.variables.map((v) =>
                    v.name === "routes"
                        ? {
                              ...v,
                              templateParameters: {
                                  routes: [
                                      ...(v.templateParameters?.routes || []),
                                      {
                                          url:
                                              prev.components.length === 0
                                                  ? ""
                                                  : `${prev.components.length}`,
                                          component: newPage.id,
                                      },
                                  ],
                              },
                          }
                        : v
                ),
                components: [...prev.components, newPage],
            };
        });
    };
    const onPageClick = (id: string) => {
        setActiveComponent(id);
    };

    return (
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
            <List subheader={<ListSubheader component="div">Actions</ListSubheader>}>
                <ListItem button disabled={loading} onClick={onGenerateClick}>
                    <ListItemIcon>
                        <BuildIcon />
                    </ListItemIcon>
                    <ListItemText primary={loading ? "Generating..." : "Generate"} />
                </ListItem>
                <ListItem button onClick={onOptionsClick}>
                    <ListItemIcon>
                        <TuneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Options" />
                </ListItem>
                <ListItem button onClick={onNewPageClick}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="New page" />
                </ListItem>
            </List>
            <List subheader={<ListSubheader component="div">Pages</ListSubheader>}>
                {site.components.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="Empty page list" />
                    </ListItem>
                ) : (
                    site.components
                        .filter((c) => c.templateId === "page")
                        .map((c) => (
                            <ListItem
                                key={c.id}
                                button
                                onClick={() => onPageClick(c.id)}
                                selected={activeComponent === c.id}
                            >
                                <ListItemText primary={c.name} />
                            </ListItem>
                        ))
                )}
            </List>
            {children}
        </Drawer>
    );
};

const PagesEditor: React.FC = () => {
    const classes = useStyles();
    const [site, setSite] = useState<SiteConfig>(new SiteConfig());
    const [activeComponent, setActiveComponent] = useState<string>();
    const [activeChildComponent, setActiveChildComponent] = useState<string>();
    const { loading, error, data, refetch } = useQuery(UPDATE_SITE, {
        variables: { value: JSON.stringify(site) },
    });
    useEffect(() => {
        refetch();
    }, [site]);
    const setComponents = (components: (prev: ComponentConfig[]) => ComponentConfig[]) =>
        setSite((prev) => ({ ...prev, components: components(prev.components) }));

    const setSelections = (id: string) => {
        setActiveComponent(id);
        setActiveChildComponent(undefined);
    };

    return (
        <div className={classes.root}>
            <ComponentsEditorDrawer
                site={site}
                setSite={setSite}
                activeComponent={activeComponent}
                setActiveComponent={setSelections}
            >
                {activeComponent && (
                    <List subheader={<ListSubheader component="div">Page layout</ListSubheader>}>
                        <ComponentListItem
                            id={activeComponent}
                            depth={0}
                            components={site.components}
                            setComponents={setComponents}
                            activeChildComponent={activeChildComponent}
                            setActiveChildComponent={setActiveChildComponent}
                        />
                    </List>
                )}
            </ComponentsEditorDrawer>
            <main className={classes.content}>
                {activeComponent && (
                    <ComponentContainer
                        id={activeComponent}
                        components={site.components}
                        setComponents={setComponents}
                        setActiveChildComponent={setActiveChildComponent}
                    />
                )}
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
                {activeChildComponent && (
                    <>
                        <VariablesEditor id={activeChildComponent} site={site} setSite={setSite} />
                        <List subheader={<ListSubheader component="div">Options</ListSubheader>}>
                            <OptionsEditor
                                id={activeChildComponent}
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
