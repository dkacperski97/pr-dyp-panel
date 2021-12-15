import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useDrag } from "react-dnd";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            cursor: "move"
        },
        content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        main: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        drag: {
            position: "absolute"
        }
    })
);

type NewComponentProps = {
    component: any; // Component;
};
const NewComponent: React.FC<NewComponentProps> = ({ component }) => {
    const classes = useStyles();

    const [collected, drag] = useDrag(
        () => ({
            type: component.type,
            item: { id: component.id },
        }),
        []
    );

    return (
        <Card ref={drag} {...collected} className={classes.card}>
                <CardContent className={classes.content}>
                    <DragIndicatorIcon className={classes.drag}/>
                    <div className={classes.main}>
                        <Avatar>
                            <WebAssetIcon />
                        </Avatar>
                        <Typography variant="subtitle2" component="div">
                            {component.id}
                        </Typography>
                    </div>
                </CardContent>
        </Card>
    );
};

export default NewComponent;