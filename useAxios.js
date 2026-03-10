import axios from "axios";

const baseUrl = "http://localhost:3001/api/inft3050";
const baseUrlShort = "http://localhost:3001";

function useAxios() {
  // log in
  async function postLoginIn() {
    try {
      const response = await axios.post(`${baseUrlShort}/login`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  //logout
  async function postLogOut() {
    try {
      const response = await axios.post(`${baseUrlShort}/logout`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async function getProductPage() {
    try {
      const response = await axios.get(`${baseUrl}/Product`, {
        params: {
          limit: 2000,
        }, // higher limit set to view all products; currently Postman returns 438 or something // Captain Jacq I salute u for this
      });
      return response.data.list;
    } catch (error) {
      return [];
    }
  }

  async function getAllStock() {
    try {
      const response = await axios.get(`${baseUrl}/Stocktake`, {
        params: {
          limit: 2000,
        }, // higher limit set to view all products; currently Postman returns 438 or something // Captain Jacq I salute u for this
      });
      return response.data.list;
    } catch (error) {
      return [];
    }
  }

  async function getMergedData() {
    let mergedProductList = [];
    try {
      // The urls needed are already defined so using those functions
      // NOTE: getProductPage and getAllStock are defined above, so calling them here is correct.
      const promiseProductPage = getProductPage();
      const promiseAllStock = getAllStock();
      // This is where the merging starts

      const [productList, stocktakeList] = await Promise.all([
        promiseProductPage,
        promiseAllStock,
      ]); // using map as the product id is FK in stocktake. this will help with mapping productid with product ID and get the correct price and quantity

      // loop through all products
      for (let i = 0; i < productList.length; i++) {
        const product = productList[i];

        // find all stock records for this product
        const matchingStocks = stocktakeList.filter(
          (stock) => stock.ProductId === product.ID
        );

        // if no stock found, add one empty entry
        if (matchingStocks.length === 0) {
          mergedProductList.push({
            ...product,
            ItemId: 0,
            Price: 0,
            Quantity: 0,
            SourceId: 0,
            SourceName: "No Source Available",
            ProductName: product.Name || "Unknown Product",
          });
        }

        // if stock found, add one row for each source
        for (let j = 0; j < matchingStocks.length; j++) {
          const stockData = matchingStocks[j];
          mergedProductList.push({
            ...product,
            ItemId: stockData.ItemId || 0,
            Price: stockData.Price || 0,
            Quantity: stockData.Quantity || 0,
            SourceId: stockData.SourceId || 0,
            SourceName: stockData.Source?.SourceName || "Unknown Source",
            ProductName:
              stockData.Product?.Name || product.Name || "Unknown Product",
          });
        }
      }

      return mergedProductList;
    } catch (error) {
      return mergedProductList;
    }
  }

  //product with genre
  async function getProductPageWithGenre() {
    let mergedProductGenreList = [];
    try {
      // The urls needed are already defined so using those functions
      // NOTE: getProductPage and getGenre are defined above, so calling them here is correct.
      const promiseProductPage = getProductPage();
      const promiseGenre = getGenre();
      // This is where the merging starts

      const [productList, genreListResponse] = await Promise.all([
        promiseProductPage,
        promiseGenre,
      ]); // using map as the product id can be found inside each genres Product List to match and get the correct genre name

      const genreList = genreListResponse.list || [];

      mergedProductGenreList = productList.map((product) => {
        // find the genre that contains this product
        const genreRecord = genreList.find((genre) => {
          const productListInsideGenre = genre["Product List"] || []; //  the array product list
          const productMatch = productListInsideGenre.find(
            (genreProd) => genreProd.ID === product.ID
          );
          return productMatch; // returns true if product found
        });

        const genreData = genreRecord || {};

        return {
          // added spreader for product so that getProductPageWithGenre includes all the entities of the product
          ...product,
          GenreID: genreData.GenreID || 0,
          GenreName: genreData.Name || "Unknown Genre",
        };
      });

      console.log("Merged Product + Genre List:", mergedProductGenreList);
      return mergedProductGenreList;
    } catch (error) {
      console.log(error.message);
      return mergedProductGenreList;
    }
  }

  // get Patron
  async function getPatron() {
    try {
      const response = await axios.get(`${baseUrl}/Patrons`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  // Patch Patron--untested due to back end issue
  async function updatePatron() {
    try {
      const response = await axios.patch(`${baseUrl}/Patrons`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  //get User
  async function getUser() {
    try {
      const response = await axios.get(`${baseUrl}/User`, {
        headers: {
          withCredentials: true,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  //get Genre
  async function getGenre() {
    try {
      const response = await axios.get(`${baseUrl}/Genre`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  //post Stock -- untested due to backend issue
  async function postStock(newStock) {
    try {
      const response = await axios.post(`${baseUrl}/Stocktake`, newStock, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw error;
    }
  }

  // put Stock -- untested due to backend issue
  async function updateStock(stock) {
    try {
      await axios.put(`${baseUrl}/Stocktake/${stock.ID}`, stock, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating stock:", error.message);
      throw error;
    }
  }

  //Get Orders
  async function getOrder() {
    try {
      const response = await axios.get(`${baseUrl}/Orders`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data.list;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw error;
    }
  }

  //Get TO -- for shipping address--unetsted for checkout --due to backend issue
  async function getTO() {
    try {
      const response = await axios.get(`${baseUrl}/TO`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data.list;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw error;
    }
  }
  //Post Orders -- untested due to backend issue-- this is design to post the new orders into the backend and theget orders will get updated with the new orders
  async function createOrder(newOrder) {
    try {
      const response = await axios.post(`${baseUrl}/Orders`, newOrder, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw error;
    }
  }

  // get customer order to display the orders under My Orders page
  async function getCustomerOrders(customerId) {
    try {
      // get orders and merged stock data in parallel
      const [orders, mergedStock] = await Promise.all([
        getOrder(),
        getMergedData(),
      ]);

      // filter order based on customer
      const customerOrders = orders.filter(
        (order) => order.TO?.PatronId === customerId
      );

      // map orders and match each stocktake entry with merged stock
      const customerOrderRecord = customerOrders.map((order) => {
        const stocktakeList = order["Stocktake List"] || []; // same logic as genre["Product List"] || []

        const mappedStockList = stocktakeList.map((entry) => {
          const match = mergedStock.find(
            (item) => item.ItemId === entry.ItemId
          );
          return {
            ...entry,
            ProductName: match?.ProductName || "Unknown Product",
            Price: match?.Price ?? 0,
            Quantity: match?.Quantity ?? 0,
            SourceName: match?.SourceName || "Unknown Source",
          };
        });

        // spreader to get everything from order -- not getting quantity as it may come from mergedstock instead of order as the payload for order doesn't have quantity
        return {
          ...order,
          StocktakeList: mappedStockList, // replacing original Stocktake List with mapped version
        };
      });

      return customerOrderRecord;
    } catch (error) {
      console.error("Error merging customer orders:", error.message);
      return [];
    }
  }

  // get customer address to display under the profile page
  async function getCustomerAddress(customerId) {
    const orders = await getOrder();

    const match = orders.find((order) => order.Customer === customerId);
    return match
      ? {
          street: match.StreetAddress,
          suburb: match.Suburb,
          state: match.State,
          postcode: match.PostCode,
        }
      : null;
  }

  return {
    getProductPage,
    getAllStock,
    getMergedData,
    getPatron,
    getUser,
    getGenre,
    updatePatron,
    postStock,
    postLoginIn,
    postLogOut,
    getProductPageWithGenre,
    createOrder,
    getOrder,
    getTO,
    updateStock,
    getCustomerOrders,
    getCustomerAddress,
  };
}
export default useAxios;
