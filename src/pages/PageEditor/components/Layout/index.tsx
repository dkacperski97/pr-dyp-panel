import React from 'react';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import ComponentListItem from './ComponentListItem';
import ComponentConfig from "../../../../types/component";
import SiteConfig from "../../../../types/site";
import Editor from "../../../../types/editor";
import TreeView from '@material-ui/lab/TreeView';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
        treeView: {
            width: "100%"
        }
    })
);

type LayoutProps = {
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
};
const Layout: React.FC<LayoutProps> = ({ site, setSite, editor, setEditor }) => {
    const classes = useStyles();
    const setComponents = (components: (prev: ComponentConfig[]) => ComponentConfig[]) =>
        setSite((prev) => ({ ...prev, components: components(prev.components) }));

    return editor.activePage ? (
        <>
            <Divider />
            <List
                subheader={<ListSubheader component="div">Page layout</ListSubheader>}
                className={classes.layout}
            >
                <TreeView selected={editor.activeComponent}
                        expanded={site.components.map(c => c.id)} className={classes.treeView}>
                    <ComponentListItem
                        id={editor.activePage}
                        depth={0}
                        components={site.components}
                        setComponents={setComponents}
                        editor={editor}
                        setEditor={setEditor}
                    />
                </TreeView>
            </List>
        </>
    ) : null;
}

export default Layout;
