import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ComponentConfig from "../../../../types/component";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDrop } from "react-dnd";
import * as templates from "components";
import Variable from "../../../../types/variable";

type ComponentListItemValueProps = {
    id: string;
    childComponent: ComponentConfig;
    depth: number;
    activeComponent: string | undefined;
    templateObject: any;
    onClick: () => void;
    onDeleteClick: () => void;
    setComponents: (components: (prev: ComponentConfig[]) => ComponentConfig[]) => void;
};
const ComponentListItemValue: React.FC<ComponentListItemValueProps> = ({
    id,
    depth,
    activeComponent,
    childComponent,
    templateObject,
    onClick,
    onDeleteClick,
    setComponents,
}) => {
    const [, drop] = useDrop(() => ({
        accept: "Common", // TODO templateObject.type,
        drop: (item: any) => {
            const c = templates.components.find((c) => c.id === item.id);
            if (c) {
                console.log("drop", id)
                setComponents((prev) => {
                    const variables = c.getOptions
                        .filter((o) => o.default !== undefined)
                        .map(
                            (o) =>
                                new Variable(
                                    o.id,
                                    o.default!.templateId,
                                    o.default!.templateParameters
                                )
                        );
                    const options: any = {};
                    variables.forEach((v) => (options[v.name] = v.id));
                    const newComponent = new ComponentConfig(
                        item.id + (prev.length + 1),
                        item.id,
                        variables,
                        options
                    );
                    return [
                        ...prev.map((c) =>
                            c.id === id ? { ...c, children: [...c.children, newComponent.id] } : c
                        ),
                        newComponent,
                    ];
                });
            }
        },
    }), [id]);
    return (
        <ListItem ref={drop} button onClick={onClick} selected={activeComponent === id}>
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

export default ComponentListItemValue;