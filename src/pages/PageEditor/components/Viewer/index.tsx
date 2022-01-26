import React, { useState, useEffect } from 'react';
import Editor from "../../../../types/editor";
import SiteConfig from "../../../../types/site";
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/client';


// @ts-ignore
import PageViewer from "output/components";

// @ts-ignore
import * as SiteContext from "output/SiteContext";

// @ts-ignore
import useClient from "output/useClient";

const generateClassName = createGenerateClassName({
    seed: 'custom',
});

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
    const [client] = useClient();

    return (name && PageViewer) ? (
        <>
            <ApolloProvider client={client}>
                <StylesProvider generateClassName={generateClassName}>
                    <SiteContext.SiteProvider>
                        <React.Suspense fallback="Loading Button">
                            <PageViewer name={name} />
                        </React.Suspense>
                    </SiteContext.SiteProvider>
                </StylesProvider>
            </ApolloProvider>
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