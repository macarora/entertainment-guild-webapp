import { List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchResultsList({ results, clearSearch }) {
  const navigate = useNavigate();
  // handleClick take care of clearing the search box and navigating to the correect product.
  const handleClick = (id) => {
    clearSearch();
    navigate(`/product/${id}`);
  };

  return (
    <List>
      {results.map((result) => (
        <ListItemButton key={result.ID} onClick={() => handleClick(result.ID)}>
          {result.Name}
        </ListItemButton>
      ))}
    </List>
  );
}
