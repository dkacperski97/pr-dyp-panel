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
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import VariableConfiguration from "./VariableConfiguration";

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
        subheader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
        },
    })
);

type VariablesEditorProps = {
    component: ComponentConfig;
    templateObject: any;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const VariablesEditor: React.FC<VariablesEditorProps> = ({ component, templateObject, site, setSite }) => {
    const [activeVariable, setActiveVariable] = useState<string>();
    const [variable, setVariable] = useState<Variable>();
    const classes = useStyles();

    useEffect(() => {
        if (component) {
            const v = component.variables.find((v) => v.id === activeVariable);
            if (variable !== v) {
                setVariable(v);
            }
        } else if (variable !== undefined) {
            setVariable(undefined);
        }
    }, [component, variable, activeVariable]);

    const onAddClick = () => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === component.id
                    ? {
                          ...c,
                          variables: [
                              new Variable(`variable${c.variables.length + 1}`, 'query', { query: "query { location }" }),
                              ...c.variables,
                          ],
                      }
                    : c
            ),
        }));
    };
    const onVarClick = (id: string) => {
        setActiveVariable(id);
    };
    const onVariableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === component.id
                    ? {
                          ...c,
                          variables: c.variables.map((v) =>
                              v.id === variable!.id ? { ...v, name: event.target.value } : v
                          ),
                      }
                    : c
            ),
        }));
    };

    return (
        <>
            <List
                subheader={
                    <ListSubheader className={classes.subheader} component="div">
                        Additional variables
                        <IconButton size="small" edge="end" onClick={onAddClick}>
                            <AddIcon />
                        </IconButton>
                    </ListSubheader>
                }
            >
                {component.variables
                    .filter((v) => !templateObject.getOptions.some((o: any) => o.id === v.name))
                    .length === 0 ? (
                    <ListItem>
                        <ListItemText primary="Empty list" />
                    </ListItem>
                ) : (
                    component.variables
                        .filter((v) => !templateObject.getOptions.some((o: any) => o.id === v.name))
                        .map((v) => (
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
                <List>
                    <ListItem>
                        <TextField
                            id="var_name"
                            label="Name"
                            type="text"
                            value={variable.name}
                            onChange={onVariableNameChange}
                        />
                    </ListItem>
                    <VariableConfiguration 
                        component={component}
                        variable={variable}
                        site={site}
                        setSite={setSite}
                    />
                </List>
            )}
        </>
    );
};

export default VariablesEditor;
