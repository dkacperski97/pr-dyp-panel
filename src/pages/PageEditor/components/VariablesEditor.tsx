import React, { Suspense, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
import * as templates from "components";
import ComponentConfig from "../../../types/component";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import SiteConfig from "../../../types/site";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Variable from "../../../types/variable";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
        formControl: {
            width: "100%",
            display: "flex",
            flex: "1 1 auto",
            flexWrap: "wrap",
        },
        listItem: {
            flexWrap: "wrap",
        },
    })
);

type VariablesEditorProps = {
    id: string;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const VariablesEditor: React.FC<VariablesEditorProps> = ({ id, site, setSite }) => {
    const [activeVariable, setActiveVariable] = useState<string>();
    const [component, setComponent] = useState<ComponentConfig>();
    const [variable, setVariable] = useState<Variable>();
    const [hookTemplateObject, setHookTemplateObject] = useState<any>();
    const [HookForm, setHookForm] = useState<any>();
    const classes = useStyles();

    useEffect(() => {
        const c = site.components.find((c) => c.id === id);
        if (component !== c) {
            setComponent(c);
            // setActiveVariable(undefined);
        }
    }, [site, component, id])
    useEffect(() => {
        if (component) {
            const v = component.variables.find((v) => v.id === activeVariable)
            if (variable !== v) {
                setVariable(v);
            }
        } else if (variable !== undefined) {
            setVariable(undefined)
        }
    }, [component, variable, activeVariable])
    useEffect(() => {
        const newHookTemplateObject = variable ? templates.hooks.find((h) => h.id === variable.templateId) : undefined;
        if (hookTemplateObject !== newHookTemplateObject) {
            setHookTemplateObject(newHookTemplateObject)
            setHookForm(newHookTemplateObject ? React.lazy(newHookTemplateObject.getEditorForm) : undefined);
        }
    }, [variable, hookTemplateObject])

    if (!component) {
        return null;
    }
    if (variable && variable.templateId) {
        if (!hookTemplateObject) {
            return null;
        }
    }

    const onVariableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          variables: c.variables.map((v) =>
                              v.id === activeVariable
                                  ? { ...v, name: event.target.value }
                                  : v
                          ),
                      }
                    : c
            ),
        }));
    }
    const onTemplateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          variables: c.variables.map((v) =>
                              v.id === activeVariable
                                  ? { ...v, templateId: event.target.value as string, templateParameters: undefined }
                                  : v
                          ),
                      }
                    : c
            ),
        }));
    };
    const onAddClick = () => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          variables: [
                              ...c.variables,
                              new Variable(`variable${c.variables.length + 1}`),
                          ],
                      }
                    : c
            ),
        }));
    };
    const onVarClick = (id: string) => {
        setActiveVariable(id);
    };

    return (
        <>
            <List subheader={<ListSubheader component="div">Variables</ListSubheader>}>
                <ListItem button onClick={() => onAddClick()}>
                    <ListItemText primary="Add" />
                </ListItem>
                {component.variables.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="Empty variables list" />
                    </ListItem>
                ) : (
                    component.variables.map((v) => (
                        <ListItem
                            key={v.id}
                            button
                            onClick={() => onVarClick(v.id)}
                            selected={activeVariable === v.id}
                        >
                            <ListItemText key={v.id} primary={v.name} />
                        </ListItem>
                    ))
                )}
            </List>
            {variable && (
                <List
                    subheader={
                        <ListSubheader component="div">Variable configuration</ListSubheader>
                    }
                >
                    <ListItem>
                        <TextField
                            id="var_name"
                            label="Name"
                            type="text"
                            value={variable.name}
                            onChange={onVariableNameChange}
                        />
                    </ListItem>
                    <ListItem>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select_template_label">Template</InputLabel>
                            <Select
                                labelId="select_template_label"
                                id="select_template"
                                value={variable.templateId || ""}
                                onChange={onTemplateChange}
                            >
                                {templates.hooks.map((h) => (
                                    <MenuItem value={h.id} key={h.id}>
                                        {h.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                    {HookForm && (
                        <ListItem className={classes.listItem}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <HookForm site={site} setSite={setSite} componentId={id} variableId={variable.id} />
                            </Suspense>
                        </ListItem>
                    )}
                </List>
            )}
        </>
    );
};

export default VariablesEditor;
