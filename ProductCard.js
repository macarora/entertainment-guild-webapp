import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CardActionArea, Skeleton, Box, Tooltip, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function ProductCard({
  ID,
  Name,
  Author,
  Description,
  Image,
  Price,
  GenreName,
}) {
  const [expanded, setExpanded] = React.useState(false);
  console.log("Product ID:", ID);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        width: 300, // fixed width
        height: 420, // fixed height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardActionArea component={RouterLink} to={`/product/${ID}`}>
        {/* Changed the format to Have the Image Placeholder(Skeleton) on top -- I have an Annoying 11yr old with ideas and suggestion which are Usually CORRECT!!!  */}
        <Box sx={{ height: 194, width: "100%", mb: 1 }}>
          {Image ? (
            <CardMedia
              component="img"
              height="194"
              src={Image}
              alt={Name}
              sx={{ objectFit: "cover" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={194}
              animation="wave"
            />
          )}
        </Box>

        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          id={ID}
          title={
            <Typography variant="h6" component="div">
              {Name}
            </Typography>
          }
          subheader={
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {Author}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {GenreName}
              </Typography>
            </Box>
          }
        />
      </CardActionArea>

      <CardActions disableSpacing>
        <Tooltip title="Add to favorites (coming soon)">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share (coming soon)">
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="subtitle2" color="text.secondary">
          ${Price}
        </Typography>

        <Tooltip title="Expand more (coming soon)">
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
