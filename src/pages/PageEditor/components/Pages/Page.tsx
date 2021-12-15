import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import LanguageIcon from "@material-ui/icons/Language";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Editor from "../../../../types/editor";
import ComponentConfig from "../../../../types/component";
import Divider from "@material-ui/core/Divider";

type PageProps = {
    editor: Editor;
    setEditor: React.Dispatch<React.SetStateAction<Editor>>;
    page: ComponentConfig;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing(1),
        },
        name: {
            flexGrow: 1,
            paddingLeft: theme.spacing(1),
        },
        card: {
            marginTop: (props: PageProps) => props.editor.activePage === props.page.id ? -2 : undefined,
            borderWidth: (props: PageProps) => props.editor.activePage === props.page.id ? 2 : undefined,
            borderColor: (props: PageProps) => props.editor.activePage === props.page.id ? theme.palette.primary.main : undefined,
        },
        img: {
            objectFit: "contain",
            objectPosition: "top"
        }
    })
);

const Page: React.FC<PageProps> = (props) => {
    const classes = useStyles(props);
    const { editor, setEditor, page } = props;

    const onPageClick = (id: string) => {
        setEditor((prev) => ({ ...prev, activePage: id, showLayout: true }));
    };

    return (
        <Card className={classes.card} variant={ editor.activePage === page.id ? "outlined" : "elevation"}>
            <CardActionArea onClick={() => onPageClick(page.id)}>
                <CardContent className={classes.cardHeader}>
                    <LanguageIcon fontSize="small" />
                    <Typography className={classes.name} variant="subtitle2" component="div">
                        {page.name}
                    </Typography>
                    <IconButton size="small" edge="end">
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </CardContent>
                <Divider />
                <CardMedia component="img" className={classes.img} height={ editor.activePage === page.id ? 138 : 140} src={editor.screenshots[page.id]} />
            </CardActionArea>
        </Card>
    );
};

export default Page;