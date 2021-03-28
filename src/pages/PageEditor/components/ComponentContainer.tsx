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
            border: "solid 2px red",
        },
    })
);

type ComponentContainerProps = {
    layout: Layout;
    setLayout: (layout: (prev: Layout) => Layout) => void;
};
const ComponentContainer: React.FC<ComponentContainerProps> = ({
    layout,
    setLayout,
}) => {
    const classes = useStyles();
    const componentObject = components.find((c) => c.id === layout.componentId);
    const setChildLayout = (
        childLayout: (prev: Layout) => Layout,
        index: number
    ) =>
        setLayout((prev: Layout) => ({
            ...prev,
            children: prev.children.map((child, i) =>
                i === index ? childLayout(child) : child
            ),
        }));

    const setChild: Props["setChild"] = (componentId, index) => {
        const helper = (prev: Layout[]) => {
            let prevCopy = prev.slice();
            prevCopy[index] = {
                componentId,
                config: [],
                children: []
            }
            return prevCopy;
        }
        setLayout(prev => ({...prev, children: helper(prev.children) }))
    };

    return componentObject ? (
        <div className={classes.container}>
            <componentObject.component config={layout.config} setChild={setChild} >
                {layout.children.map((child, i) => (
                    <ComponentContainer
                        key={i}
                        layout={child}
                        setLayout={(childLayout) =>
                            setChildLayout(childLayout, i)
                        }
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