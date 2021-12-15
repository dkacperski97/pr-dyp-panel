import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SiteConfig from "../../../types/site";
import ComponentConfig from "../../../types/component";
import OptionsEditor from "./OptionsEditor";
import VariablesEditor from "./VariablesEditor";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import * as templates from "components";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
        title: {
            margin: theme.spacing(2),
        }
    })
);

type ComponentConfiguratorProps = {
    id: string;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const ComponentConfigurator: React.FC<ComponentConfiguratorProps> = ({ id, site, setSite, children }) => {
    const [component, setComponent] = useState<ComponentConfig>();
    const [templateObject, setTemplateObject] = useState<any>();
    const classes = useStyles();

    useEffect(() => {
        const c = site.components.find((c) => c.id === id);
        if (component !== c) {
            setComponent(c);
        }
    }, [site.components, id, component])
    useEffect(() => {
        const t = component ? templates.components.find((c) => c.id === component.templateId) : undefined;
        if (templateObject !== t) {
            setTemplateObject(t);
        }
    }, [component, templateObject])
    if (!component || !templateObject) {
        return (
            <Paper className={classes.paper}>ERROR</Paper> // TODO
        );
    }

    return component && templateObject && component.templateId === templateObject.id ? (
        <>
            <Typography variant="h5" className={classes.title}>
                {component.name}
            </Typography>
            <VariablesEditor
                component={component}
                templateObject={templateObject}
                site={site}
                setSite={setSite}
            />
            <List subheader={<ListSubheader component="div">Options</ListSubheader>}>
                <OptionsEditor
                    component={component}
                    templateObject={templateObject}
                    site={site}
                    setSite={setSite}
                />
            </List>
        </>
    ) : (
        <div></div>
    );
}

export default ComponentConfigurator;