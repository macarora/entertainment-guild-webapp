import { Box, Pagination, Grid, Link } from "@mui/material";
import ProductCard from "../Components/ProductCard";
import { useState } from "react";

// Number of products on a page
const pageSize = 12;

//use from MUI
export default function AppPagination({ items = [], path }) {
  const [page, setPage] = useState(1);

  //Calculation for total number of Pages using Math.ceil

  const totalPages = Math.ceil(items.length / pageSize);

  //Function to handle the pagination
  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const startPage = (page - 1) * pageSize;
  const endPage = (page - 1) * pageSize + pageSize;
  const itemsToDisplay = items.slice(startPage, endPage);

  return (
    <Box>
      {/* Box to display the items */}
      <Grid
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
        wrap="wrap"
      >
        {itemsToDisplay.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.ID}>
            {/*Path prop used to make AppPagination Modular */}
            <Link to={`{path}/${item.ID}`} style={{ textDecoration: "none" }}>
              {/* There is bug in the 1st componenet has to be a state issue - Product array same as item array for fruits map function */}
              <ProductCard
                ID={item.ID}
                Name={item.Name}
                Author={item.Author}
                Genre={item.Genre}
                Description={item.Description}
                Price={item.Price}
                GenreName={item.GenreName}
              />
            </Link>
          </Grid>
        ))}
      </Grid>

      {/*Wrapped Pagination in Box componenet to center it */}
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        sx={{ margin: "20px 0px" }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
}
