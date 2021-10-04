import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ComponentConfig from "../../../../types/component";
import SiteConfig from "../../../../types/site";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Editor from "../../../../types/editor";
import Page from "./Page";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            marginTop: theme.spacing(4),
            height: "400px",
            maxHeight: "400px",
            overflowY: "auto",
        },
        subheader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
        },
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

type PagesProps = {
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
    site: SiteConfig;
    setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
};
const Pages: React.FC<PagesProps> = ({ site, setSite, editor, setEditor }) => {
    const classes = useStyles();

    const onNewPageClick = () => {
        setSite((prev) => {
            let pageIndex = 1;
            const pages = prev.components.filter((c) => c.templateId === "page");
            while (pages.find((p) => p.name === `Page${pageIndex}`)) {
                pageIndex++;
            }
            const newPage = new ComponentConfig(`Page${pageIndex}`, "page");
            setEditor((prev) => ({ ...prev, activePage: newPage.id }));
            return {
                ...prev,
                variables: prev.variables.map((v) =>
                    v.name === "routes"
                        ? {
                              ...v,
                              templateParameters: {
                                  routes: [
                                      ...(v.templateParameters?.routes || []),
                                      {
                                          url:
                                              prev.components.length === 0
                                                  ? ""
                                                  : `${prev.components.length}`,
                                          component: newPage.id,
                                      },
                                  ],
                              },
                          }
                        : v
                ),
                components: [...prev.components, newPage],
            };
        });
    };

    return (
        <List
            className={classes.list}
            subheader={
                <ListSubheader className={classes.subheader} component="div">
                    Pages
                    <IconButton size="small" edge="end" onClick={onNewPageClick}>
                        <AddIcon />
                    </IconButton>
                </ListSubheader>
            }
        >
            {site.components.length === 0 ? (
                <ListItem>
                    <ListItemText primary="Empty page list" />
                </ListItem>
            ) : (
                <div className={classes.grid}>
                    {
                site.components
                    .filter((c) => c.templateId === "page")
                    .map((c) => (
                        <div key={c.id} style={{ gridColumnEnd: 'span 1' }}>
                            <Page editor={editor} setEditor={setEditor} page={c} />
                        </div>
                    ))
                }
                </div>
            )}
        </List>
    );
};

export default Pages;
