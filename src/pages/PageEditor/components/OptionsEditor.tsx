import React, { Suspense } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as templates from "components";
import ComponentConfig from "../../../types/component";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import SiteConfig from "../../../types/site";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
        formControl: {
            width: '100%',
            display: 'flex',
            flex: '1 1 auto',
            flexWrap: 'wrap'
        },
        listItem: {
            flexWrap: 'wrap'
        }
    })
);

type OptionsEditorProps = {
    id: string;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const OptionsEditor: React.FC<OptionsEditorProps> = ({ id, site, setSite }) => {
    const classes = useStyles();

    const component = site.components.find((c) => c.id === id);
    if (!component) {
        return (
            <Paper className={classes.paper}>ERROR</Paper> // TODO
        );
    }
    const templateObject = templates.components.find((c) => c.id === component.templateId);
    if (!templateObject) {
        return (
            <Paper className={classes.paper}>ERROR</Paper> // TODO
        );
    }
    if (templateObject.getOptions === undefined || templateObject.getOptions.length === 0) {
        return null;
    }
    const onChange = (event: React.ChangeEvent<{ value: unknown }>, optionId: string) => {
        component.options[optionId] = event.target.value;
    };
    return (
        <ListItem className={classes.listItem}>
            {templateObject.getOptions.map((o) => (
                    <FormControl className={classes.formControl} key={o.id}>
                        <InputLabel id={`select_${o.id}_label`}>{o.id}</InputLabel>
                        <Select
                            labelId={`select_${o.id}_label`}
                            id={`select_${o.id}`}
                            value={component.options[o.id]}
                            onChange={(e) => onChange(e, o.id)}
                        >
                            {component.variables.map((v) => (
                                <MenuItem value={v.id} key={v.id}>
                                    {v.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
            ))}
        </ListItem>
    );
};

export default OptionsEditor;
