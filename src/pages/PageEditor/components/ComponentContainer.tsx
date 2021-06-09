import React, { Suspense } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as templates from "components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
// import DropTarget from "./DropTarget";
import ComponentConfig from "../../../types/component";

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
    components: ComponentConfig[];
    setComponents: (components: (prev: ComponentConfig[]) => ComponentConfig[]) => void;
    setActiveChildComponent: (activeChildComponent: string) => void;
};
const ComponentContainer: React.FC<ComponentContainerProps> = ({ id, components, setComponents, setActiveChildComponent }) => {
    const classes = useStyles();
    const component = components.find((c) => c.id === id);
    if (!component) {
        return null;
    }
    console.log(templates.components)
    const templateObject = templates.components.find((c) => c.id === component.templateId);

    /*
    const setChild: SetChild = (componentId: any, index: any) => {
        const addChildId = (prev: (string|undefined)[], id: string) => {
            let prevCopy = prev.slice();
            prevCopy[index] = id;
            return prevCopy;
        };
        const removeChildren = (newLayouts: Layout[], childId: string) => {
            let index = newLayouts.findIndex((l) => l.id === childId);
            newLayouts[index].children.forEach((subchildId) => {
                if (subchildId) {
                    removeChildren(newLayouts, subchildId)
                }
            });
            newLayouts.splice(index, 1);
        };
        const getNewLayouts = (prev: Layout[]) => {
            const parent = prev.find((p) => p.id === id);
            if (!parent) {
                console.log(prev, id);
                throw new Error("Parent not found.");
            }
            let newLayouts = prev.slice();
            const child = parent.children[index];
            if (child !== undefined) {
                removeChildren(newLayouts, child);
            }
            const newComponentLayout = new Layout(componentId);
            const parentIndex = newLayouts.findIndex((p) => p.id === id);
            newLayouts[parentIndex] = {
                ...parent,
                children: addChildId(parent.children, newComponentLayout.id),
            };
            newLayouts.push(newComponentLayout);
            setActiveComponent(newComponentLayout.id);
            console.log(prev, newLayouts);
            return newLayouts;
        };
        setLayouts((prev) => getNewLayouts(prev));
    };
    */

    if (!templateObject) {
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
    const ComponentPreview = React.lazy(templateObject.getComponent);
    return (
        <div className={classes.container}>
            <Suspense fallback={<div>Loading...</div>}>
                {(!templateObject.getOptions || component.options) && (
                    <ComponentPreview>
                        {component.children.map((child) => (
                                <ComponentContainer
                                    key={child}
                                    id={child}
                                    components={components}
                                    setComponents={setComponents}
                                    setActiveChildComponent={setActiveChildComponent}
                                />
                            )
                        )}
                    </ComponentPreview>
                )}
            </Suspense>
        </div>
    );
};

export default ComponentContainer;
