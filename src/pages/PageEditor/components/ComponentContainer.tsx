import React, { Suspense } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Layout from "../../../types/layout";
import components from "components";
import type { SetChild } from "components/types/props";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            // border: "solid 2px red",
        },
    })
);

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
                newComponent.options.forEach(option => {
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
    const ComponentObjectComponent = React.lazy(componentObject.component);
    return (
        <div className={classes.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <ComponentObjectComponent config={currentComponent.config} setChild={setChild}>
                    {currentComponent.children.map((child, i) => (
                        <ComponentContainer
                            key={child}
                            id={child}
                            layout={layout}
                            setLayout={setLayout}
                        />
                    ))}
                </ComponentObjectComponent>
            </Suspense>
        </div>
    );
};

export default ComponentContainer;
