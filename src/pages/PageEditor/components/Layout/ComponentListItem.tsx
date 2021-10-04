import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ComponentConfig from "../../../../types/component";
import * as templates from "components";
import Editor from "../../../../types/editor";
import ComponentListItemValue from "./ComponentListItemValue";

type ComponentListItemProps = {
    id: string;
    components: ComponentConfig[];
    setComponents: (components: (prev: ComponentConfig[]) => ComponentConfig[]) => void;
    depth: number;
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
};
const ComponentListItem: React.FC<ComponentListItemProps> = ({
    id,
    components,
    setComponents,
    depth,
    editor,
    setEditor,
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
        setEditor((prev) => ({ ...prev, activeComponent: id }));
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
        setEditor((prev) => ({ ...prev, activeComponent: undefined }));
    };
    console.log("tree", id)
    return (
        <>
            <ComponentListItemValue
                id={id}
                depth={depth}
                activeComponent={editor.activeComponent}
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
                            editor={editor}
                            setEditor={setEditor}
                            setComponents={setComponents}
                        />
                    )
            )}
        </>
    );
};

export default ComponentListItem;