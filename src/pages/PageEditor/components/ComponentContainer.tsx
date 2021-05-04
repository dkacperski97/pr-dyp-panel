import React, { Suspense } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Layout from "../../../types/layout";
import components from "components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import DropTarget from "./DropTarget";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            // border: "solid 2px red",
        },
    })
);

export type SetChild = (componentId: string, index: number) => void;

type ComponentContainerProps = {
    id: string;
    layout: Layout[];
    setLayout: (layout: (prev: Layout[]) => Layout[]) => void;
};
const ComponentContainer: React.FC<ComponentContainerProps> = ({ id, layout, setLayout }) => {
    const classes = useStyles();
    const currentComponent = layout.find((c) => c.id === id);
    if (!currentComponent) {
        return null;
    }
    const componentObject = components.find((c) => c.id === currentComponent.componentId);
    const setChild: SetChild = (componentId: any, index: any) => {
        const addChildId = (prev: string[], id: string) => {
            let prevCopy = prev.slice();
            prevCopy[index] = id;
            return prevCopy;
        };
        const removeChildren = (newLayout: Layout[], childId: string) => {
            let index = newLayout.findIndex((l) => l.id === childId);
            newLayout[index].children.forEach((subchildId) =>
                removeChildren(newLayout, subchildId)
            );
            newLayout.splice(index, 1);
        };
        const getNewLayout = (prev: Layout[]) => {
            const parent = prev.find((p) => p.id === id);
            if (!parent) {
                console.log(prev, id);
                throw new Error("Parent not found.");
            }
            let newLayout = prev.slice();
            if (parent.children[index] !== undefined) {
                removeChildren(newLayout, parent.children[index]);
            }
            const newComponentLayout = new Layout(componentId);
            const newComponent = components.find((c) => c.id === componentId)
            if (newComponent) {
                newComponent.getOptions({}).forEach(option => {
                    if (option.default !== undefined) {
                        newComponentLayout.config[option.id] = option.default;
                    }
                })
            }
            const parentIndex = newLayout.findIndex((p) => p.id === id);
            newLayout[parentIndex] = {
                ...parent,
                children: addChildId(parent.children, newComponentLayout.id),
            };
            newLayout.push(newComponentLayout);
            console.log(prev, newLayout);
            return newLayout;
        };
        setLayout((prev) => getNewLayout(prev));
    };

    if (!componentObject) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h2">
                        Error
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        A component with the given id cannot be found.
                    </Typography>
                </CardContent>
            </Card>
        );
    }
    const ComponentObjectComponent = React.lazy<React.FC<any>>(componentObject.getComponent);
    const childrenTypes = componentObject.getChildrenTypes?.(currentComponent.config) || [];
    return (
        <div className={classes.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <ComponentObjectComponent config={currentComponent.config}>
                    {childrenTypes.map((childTypes, i) => currentComponent.children[i] ? (
                        <ComponentContainer
                            key={currentComponent.children[i]}
                            id={currentComponent.children[i]}
                            layout={layout}
                            setLayout={setLayout}
                        />
                    ) : (
                        <DropTarget key={i} index={i} setChild={setChild} accept={childTypes} />
                    ))}
                </ComponentObjectComponent>
            </Suspense>
        </div>
    );
};

export default ComponentContainer;
