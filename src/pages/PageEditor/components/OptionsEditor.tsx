import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ComponentConfig from "../../../types/component";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import SiteConfig from "../../../types/site";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Variable from "../../../types/variable";
import VariableConfiguration from "./VariableConfiguration";
import Avatar from '@material-ui/core/Avatar';
import CodeIcon from '@material-ui/icons/Code';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listItem: {
            flexWrap: 'wrap'
        },
        optionHeader: {
            display: 'flex',
            justifyContent: "space-between",
            width: "100%",
            alignItems: 'center'

        },
        optionTitle: {
            flexGrow: 1,
            paddingLeft: theme.spacing(1),
        }
    })
);

type OptionsEditorProps = {
    component: ComponentConfig;
    templateObject: any;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const OptionsEditor: React.FC<OptionsEditorProps> = ({ component, templateObject, site, setSite }) => {
    const classes = useStyles();

    if (templateObject.getOptions === undefined || templateObject.getOptions.length === 0) {
        return null;
    }
    const onChange = (event: React.ChangeEvent<{ value: unknown }>, optionId: string) => {
        setSite((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === component.id ? { ...c, options: { ...c.options, [optionId]: event.target.value } } : c
            ),
        }));
    };
    return templateObject.getOptions
        .map((o: any) => ({ o, v: component.variables.find((v) => v.name === o.id)!}))
        .map(({o, v}: { o: any; v: Variable }) => (
        <ListItem key={o.id} className={classes.listItem}>
            <div className={classes.optionHeader}>
                <Avatar>
                    <CodeIcon />
                </Avatar>
                <Typography className={classes.optionTitle}>
                    {o.id}
                </Typography>
                {/* <FormControl size="small">
                    <InputLabel id={`select_value_label`}>Based on</InputLabel>
                    <Select
                        labelId={`select_value_label`}
                        id={`select_value`}
                        value={component.options[o.id]}
                        onChange={(e) => onChange(e, o.id)}
                    >
                        {component.variables.map((v2) => (
                            <MenuItem value={v2.id} key={v2.id}>
                                {variable.name === v2.name ? 'New value' : v2.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
            </div>
            <VariableConfiguration
                component={component}
                variable={v}
                site={site}
                setSite={setSite}
            />
        </ListItem>
    ));
};

export default OptionsEditor;
