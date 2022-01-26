import React from "react";
import List from "@material-ui/core/List";
import * as templates from "components";
import NewComponent from "./NewComponent";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ComponentType } from "components/types/component";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridGap: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        }
    })
);

const NewComponents: React.FC = () => {
    const classes = useStyles();
    
    return (
        <List>
            <div className={classes.grid}>
            {templates.components
                .filter((c) => c.type !== ComponentType.Hidden)
                .map((component: any) => (
                <div key={component.id} style={{ gridColumnEnd: 'span 1' }}>
                    <NewComponent component={component} />
                </div>
            ))}
            </div>
        </List>
    );
};

export default NewComponents;
