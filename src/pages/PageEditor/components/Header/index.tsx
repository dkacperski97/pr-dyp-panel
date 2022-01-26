import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import GetAppIcon from "@material-ui/icons/GetApp";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ImageBuilderDialog from "./ImageBuilderDialog";
import Editor from "../../../../types/editor";
import SiteConfig from "../../../../types/site";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { gql, useQuery, useApolloClient, useMutation } from "@apollo/client";
import SettingsDialog from "./SettingsDialog";

// Generate
// Options

const GET_SITES = gql`
    query {
        sites
    }
`;
const GET_SITE = gql`
    query ($id: String) {
        site(id: $id)
    }
`;
const UPDATE_SITE = gql`
    mutation ($value: String) {
        site(value: $value)
    }
`;
const DELETE_SITE = gql`
    mutation ($id: String) {
        deleteSite(id: $id)
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            minHeight: 0,
            alignItems: "flex-start",
            flexWrap: "wrap",
        },
        titleContainer: {
            display: "flex",
            flexGrow: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            display: "flex",
        },
        fabButton: {
            position: "absolute",
            zIndex: 1,
            top: 44,
            left: 0,
            right: 0,
            margin: "0 auto",
        },
    })
);

type HeaderProps = {
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const Header: React.FC<HeaderProps> = ({ editor, setEditor, site, setSite }) => {
    const classes = useStyles();
    const client = useApolloClient();
    const { loading, error, data, refetch } = useQuery<{ sites: string[] }>(GET_SITES);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
    const onOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getSite = async (id: string) => {
        setEditor(new Editor());
        const { data } = await client.query<{ site: string }>({ query: GET_SITE, variables: { id } })
        //getSite(event.target.value as string);
        console.log(data)
        let s;
        try {
            s = JSON.parse(data.site) as SiteConfig;
        } catch (e) {
            console.log(e)
            return;
        }
        console.log(s)
        setSite(s);
    }

    const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        if (event.target.value !== site.id) {
            getSite(event.target.value as string)
        }
    };

    const getId = (sites: string[]) => {
        for (let i = 1; i <= sites.length; i++) {
            if(!sites.some(s => s === "Site" + i)) {
                return "" + i;
            }
        }
        return "" + (sites.length + 1)
    }

    const newSite = async () => {
        setEditor(new Editor());
        console.log(data?.sites.length)
        const newSite = new SiteConfig("Site" + getId(data?.sites || []));
        await client.mutate({ mutation: UPDATE_SITE, variables: { value: JSON.stringify(newSite) } })
        await refetch();
        setSite(newSite);
        handleClose();
    };

    const removeSite = async () => {
        setEditor(new Editor());  
        await client.mutate({ mutation: DELETE_SITE, variables: { id: site.id } })
        if (data) {
            const s = data.sites.find(s => s !== site.id);
            if (s) {
                getSite(s);
            }
        }
        await refetch();
        handleClose();
    };

    const openSettings = async () => {
        setSettingsDialogOpen(true)
        handleClose();
    }

    return (
        <AppBar position="static" color="inherit">
            <Toolbar className={classes.toolbar}>
                <div className={classes.titleContainer}>
                    <FormControl>
                        <Select id="site-select" value={site.id} onChange={handleChange}>
                            {!data ? (
                                <MenuItem value={site.id}>{site.id}</MenuItem>
                            ) : (
                                data.sites.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    {/* <Typography variant="h5" component="h1" className={classes.title}>
                        Editor
                    </Typography> */}
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        edge="end"
                        onClick={onOptionsClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={newSite}>Create new site</MenuItem>
                        <MenuItem onClick={removeSite} disabled={!data || data.sites.length < 2}>
                            Remove site
                        </MenuItem>
                        <MenuItem onClick={openSettings}>Settings</MenuItem>
                    </Menu>
                </div>
                <Fab
                    className={classes.fabButton}
                    color="secondary"
                    size="small"
                    onClick={() => setDialogOpen(true)}
                >
                    <GetAppIcon />
                </Fab>
                <ImageBuilderDialog open={dialogOpen} setOpen={setDialogOpen} />
                <SettingsDialog open={settingsDialogOpen} setOpen={setSettingsDialogOpen} site={site} setSite={setSite} />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
