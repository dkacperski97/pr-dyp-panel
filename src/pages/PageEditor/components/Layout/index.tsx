import React from 'react';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import ComponentListItem from './ComponentListItem';
import ComponentConfig from "../../../../types/component";
import SiteConfig from "../../../../types/site";
import Editor from "../../../../types/editor";

type LayoutProps = {
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
};
const Layout: React.FC<LayoutProps> = ({ site, setSite, editor, setEditor }) => {
    const setComponents = (components: (prev: ComponentConfig[]) => ComponentConfig[]) =>
        setSite((prev) => ({ ...prev, components: components(prev.components) }));

    return editor.activePage ? (
        <>
            <Divider />
            <List
                subheader={<ListSubheader component="div">Page layout</ListSubheader>}
            >
                <ComponentListItem
                    id={editor.activePage}
                    depth={0}
                    components={site.components}
                    setComponents={setComponents}
                    editor={editor}
                    setEditor={setEditor}
                />
            </List>
        </>
    ) : null;
}

export default Layout;
