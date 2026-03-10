import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Table } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useState, useEffect } from "react";
import useAxios from "../Hooks/useAxios";
import Fuse from "fuse.js"; // Added Fuse.js for fuzzylogic search

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // Vertical padding + font size from searchIcon-- from mui
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchBar({ setResults, setQuery, query }) {
  const input = query; // query assigned to input
  const [products, setProducts] = useState([]);
  const { getProductPage } = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getProductPage();
        setProducts(productList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  //  fuzzy search
  const fuse = new Fuse(products, {
    keys: ["Name"], // search based on product name
    includeScore: true,
    threshold: 0.7, // lower = stricter match, higher = fuzzier
  });

  const handleChange = (value) => {
    setQuery(value); // for Query to match it with input

    if (value.trim() === "") {
      setResults([]); // added this because it is displaying all the products even when the search bar is empty.
      return;
    }

    // fussylogic from fuse.js to match
    const fuzzyResults = fuse.search(value);
    const matchedItems = fuzzyResults.map((result) => result.item);

    setResults(matchedItems); // stores the filtered result in setResults
    console.log("filtered product", matchedItems);
  };

  return (
    // Search bar
    <Search sx={{ mr: 2 }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={input}
        onChange={(e) => {
          handleChange(e.target.value);
          console.log("Search input:", e.target.value);
        }}
      />
    </Search>
  );
}
