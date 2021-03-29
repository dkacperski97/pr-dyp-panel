import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Layout from "../../../types/layout";
import components, { Props } from "components";
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
const ComponentContainer: React.FC<ComponentContainerProps> = ({
    id,
    layout,
    setLayout,
}) => {
    const classes = useStyles();
    const currentComponent = layout.find((c) => c.id === id);
    if (!currentComponent) {
        return null;
    }
    const componentObject = components.find(
        (c) => c.id === currentComponent.componentId
    );
    const setChild: Props["setChild"] = (componentId, index) => {
        const addChildId = (prev: string[], id: string) => {
            let prevCopy = prev.slice();
            prevCopy[index] = id;
            return prevCopy;
        };
        const removeChildren = (newLayout: Layout[], childId: string) => {
            let index = newLayout.findIndex((l) => l.id === childId);
            newLayout[index].children.forEach((subchildId) => removeChildren(newLayout, subchildId));
            newLayout.splice(index, 1);
        }
        const getNewLayout = (prev: Layout[]) => {
            const parent = prev.find((p) => p.id === id);
            if (!parent) {
                console.log(prev,  id);
                throw new Error("Parent not found.");
            }
            let newLayout = prev.slice();
            if (parent.children[index] !== undefined) {
                removeChildren(newLayout, parent.children[index]);
            }
            const newComponent = new Layout(componentId);
            const parentIndex = newLayout.findIndex((p) => p.id === id);
            newLayout[parentIndex] = {
                ...parent,
                children: addChildId(
                    parent.children,
                    newComponent.id
                ),
            };
            newLayout.push(newComponent);
            console.log(prev, newLayout);
            return newLayout;
        };
        setLayout((prev) => getNewLayout(prev));
    };

    return componentObject ? (
        <div className={classes.container}>
            <componentObject.component
                config={currentComponent.config}
                setChild={setChild}
            >
                {currentComponent.children.map((child, i) => (
                    <ComponentContainer
                        key={child}
                        id={child}
                        layout={layout}
                        setLayout={setLayout}
                    />
                ))}
            </componentObject.component>
        </div>
    ) : (
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
};

export default ComponentContainer;
