import React, { useState, useEffect } from 'react';
import Editor from "../../../../types/editor";
import SiteConfig from "../../../../types/site";

// @ts-ignore
import PageViewer from "output/components";

type ViewerProps = {
    site: SiteConfig;
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
};
const Viewer: React.FC<ViewerProps> = ({ site, editor, setEditor }) => {
    const [name, setName] = useState<string>();
    useEffect(() => {
        const c = site.components.find(c => c.id === editor.activePage);
        if (c) {
            setName(editor.activePage ? c.name : undefined);
        }
    }, [editor.activePage])

    return (name && PageViewer) ? (
        <>
            <React.Suspense fallback="Loading Button">
                <PageViewer name={name} />
            </React.Suspense>
            {/* {activeComponent && (
                <ComponentContainer
                    id={activeComponent}
                    components={site.components}
                    setComponents={setComponents}
                    setActiveChildComponent={setActiveChildComponent}
                />
            )} */}
        </>
    ) : (<div></div>)
}

export default Viewer;