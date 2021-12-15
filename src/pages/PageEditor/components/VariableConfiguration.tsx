import React, { useState, useEffect, Suspense } from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as templates from "components";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import SiteConfig from "../../../types/site";
import ComponentConfig from '../../../types/component';
import Variable from '../../../types/variable';

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
            // marginTop: theme.spacing(2),
        },
        listItem: {
            flexWrap: "wrap",
            marginBottom: theme.spacing(1),
        },
        subheader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
        },
    })
);

type VariableConfigurationProps = {
    component: ComponentConfig;
    variable: Variable;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const VariableConfiguration: React.FC<VariableConfigurationProps> = ({ component, variable, site, setSite }) => {
    const [hookTemplateObject, setHookTemplateObject] = useState<any>();
    const [HookForm, setHookForm] = useState<any>();
    const classes = useStyles();

    useEffect(() => {
        const newHookTemplateObject = variable
            ? templates.hooks.find((h) => h.id === variable.templateId)
            : undefined;
        if (hookTemplateObject !== newHookTemplateObject) {
            setHookTemplateObject(newHookTemplateObject);
            setHookForm(
                newHookTemplateObject ? React.lazy(newHookTemplateObject.getEditorForm) : undefined
            );
        }
    }, [variable, hookTemplateObject]);

    const onTemplateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log("onTemplateChange");
        setSite((prev) => {
            const result = {
                ...prev,
                components: prev.components.map((c) =>
                    c.id === component.id
                        ? {
                              ...c,
                              variables: c.variables.map((v) =>
                                  v.id === variable.id
                                      ? {
                                            ...v,
                                            templateId: event.target.value as string,
                                            templateParameters: undefined,
                                        }
                                      : v
                              ),
                          }
                        : c
                ),
            };
            console.log('onTemplateChange', result)
            return result;
        });
    };
    
    if (variable && variable.templateId) {
        if (!hookTemplateObject) {
            return null;
        }
    }

    return (
        <>
            <FormControl className={classes.formControl} margin="normal">
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
            {hookTemplateObject.id === variable.templateId && HookForm && (
                <div className={classes.listItem}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <HookForm
                            site={site}
                            setSite={setSite}
                            componentId={component.id}
                            variableId={variable.id}
                        />
                    </Suspense>
                </div>
            )}
        </>
    )
}

export default VariableConfiguration;