import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ComponentConfig from "../../../../types/component";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDrop } from "react-dnd";
import * as templates from "components";
import Variable from "../../../../types/variable";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            // flexGrow: 1,
            // minWidth: "200px"
        },
        treeItem: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%"
        },
        treeItemLabel: {
            display: "flex",
            alignItems: "center",
            width: "100%"
        }
    })
);

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
    children,
}) => {
    const classes = useStyles();
    const [, drop] = useDrop(
        () => ({
            accept: "Common", // TODO templateObject.type,
            drop: (item: any, monitor) => {
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    const c = templates.components.find((c) => c.id === item.id);
                    if (c) {
                        console.log("drop", id);
                        const getName = (templateId: string, index: number) => `${templateId}${index}`;
                        const getId = (components: ComponentConfig[], templateId: string) => {
                            let index = 1;
                            const pages = components.filter((c) => c.templateId === templateId);
                            while (pages.find((p) => p.name === getName(templateId, index))) {
                                index++;
                            }
                            return index;
                        }
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
                            const index = getId(prev, item.id);
                            const newComponent = new ComponentConfig(
                                getName(item.id, index),
                                item.id,
                                variables,
                                options
                            );
                            return [
                                ...prev.map((c) =>
                                    c.id === id
                                        ? { ...c, children: [...c.children, newComponent.id] }
                                        : c
                                ),
                                newComponent,
                            ];
                        });
                    }
                }
            },
        }),
        [id]
    );
    return (
        <TreeItem
            className={classes.treeItem}
            ref={drop}
            onClick={onClick}
            nodeId={id}
            label={
                <div className={classes.treeItemLabel}> 
                    <Typography className={classes.label}>{childComponent.name}</Typography>
                    {depth !== 0 && (
                        <IconButton edge="end" onClick={onDeleteClick}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </div>
            }
        >
            {children}
        </TreeItem>
        // <ListItem ref={drop} button onClick={onClick} selected={activeComponent === id}>
        //     <ListItemText primary={"_".repeat(depth) + childComponent.name} />
        //     {depth !== 0 && (
        //         <ListItemSecondaryAction>
        //             <IconButton edge="end" onClick={onDeleteClick}>
        //                 <DeleteIcon />
        //             </IconButton>
        //         </ListItemSecondaryAction>
        //     )}
        // </ListItem>
    );
};

export default ComponentListItemValue;
