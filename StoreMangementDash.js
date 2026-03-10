// Dashboard planned using MUI DataGrid

import useAxios from "../Hooks/useAxios";
import { useState, useEffect } from "react";
import { Box, Tooltip, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import {
  tryAddPatron,
  tryAddNewUser,
  tryDeletePatron,
  tryDeleteUser,
  tryDeleteProduct,
  tryDeleteStock,
} from "../Helpers/userHelpers";
import { useSessionContext } from "../Context/sessionContext";
import { useNavigate } from "react-router-dom";

function EditToolbar(props) {
  const { setRows, setRowModesModel, choice } = props;

  const handleClick = () => {
    setRows((oldRows) => [
      ...oldRows,
      choice === "patrons"
        ? { UserID: "", Name: "", Email: "", isNew: true }
        : choice === "users"
          ? { UserID: "", UserName: "", Name: "", Email: "", isNew: true }
          : {
              ID: "",
              Name: "",
              SubGenre: "",
              Author: "",
              Description: "",
              ItemId: "",
              Quantity: "",
              Price: "",
              UserID: "",
              UserName: "",
              Source: { SourceName: "" },
              isNew: true,
            },
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

//store dash -- imp flow and test required- on clicking eg logo and text the dash vainishes but the app bar remains-- need ot check user authentication -- and implement session and local storage now since almost all imp componetns are locked in.
export default function StoreMangementDash({ choice = "products" }) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const { userInfo, isAuthenticated, loadingSession, logout } =
    useSessionContext();
  const navigate = useNavigate();
  const getRowId = (row) => {
    if (choice === "patrons") return row.UserID;
    if (choice === "products") return row.ID;
    if (choice === "stock") return row.ItemId;
    if (choice === "order") return row.Customer;
    return row; // added math.random() since dont have access to user due to changes in compose.yml - didnt work so just leaving at row so that it doenst give me runtime errors
  }; // row breaks the admin dash and the only way is to signout and sign in. unfrotunately db permission are throwing bit of a fit.

  const {
    getPatron,
    getMergedData,
    updatePatron,
    getOrder,
    getProductPageWithGenre,
    getUser,
    postStock,
    updateStock,
    getTO,
  } = useAxios();

  // using a refresh function to refresh the dashabaord with updated values form db. This will be handled in handled in when user clicks save
  const refreshAll = async () => {
    try {
      let data = [];
      if (choice === "patrons") {
        const response = await getPatron();
        data = response.list;
      } else if (choice === "users") {
        const response = await getUser();
        data = response.list;
      } else if (choice === "products") {
        data = await getProductPageWithGenre();
      } else if (choice === "stock") {
        data = await getMergedData();
      }
      setRows(data);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  // proably not required for me need to check what this as it was from MUI datgrid component
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // need to add patch request logic
  const handleEditClick = (ID) => () => {
    setRowModesModel({ ...rowModesModel, [ID]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (ID) => async () => {
    setRowModesModel({ ...rowModesModel, [ID]: { mode: GridRowModes.View } });

    const updatedRow = rows.find((row) => getRowId(row) === ID);
    if (!updatedRow) return;

    // choice is added since i have patron and user in the app bar. this checks if patron is selected then it allows to addpatron. -- should not to be handled from here but need to create patrons to test patron flow
    // there is backend issue unable to test--was workign earlier
    if (choice === "patrons") {
      if (updatedRow?.isNew) {
        if (!updatedRow.Email || !updatedRow.Name) {
          console.warn("Missing required fields");
          return;
        }

        await tryAddPatron(
          updatedRow.Email,
          updatedRow.Name,
          "defaultPassword123",
          (res) => console.log("Patron creation:", res)
        );
        await refreshAll();
        updatedRow.isNew = false;
        setRows((prev) =>
          prev.map((row) => (getRowId(row) === ID ? updatedRow : row))
        );
      } else {
        await updatePatron(updatedRow);
      }
      await refreshAll();
    }
    // to add users by users-- default password added and will keep the logic and implement update/chnage password once user logged it as post request will work only if the user is logged in.
    // due to some backend issue some unknow reasons are now not working, hence unable to test--was working earlier
    if (choice === "users") {
      if (updatedRow?.isNew) {
        if (!updatedRow.Email || !updatedRow.Name) {
          console.warn("Missing required fields");
          return;
        }

        const createdUser = await tryAddNewUser(
          updatedRow.UserName || updatedRow.Email,
          "defaultPassword123",
          updatedRow.Name,
          updatedRow.Email,
          (res) => console.log("User creation:", res)
        );

        if (createdUser) {
          updatedRow.isNew = false;
          updatedRow.UserID = createdUser.UserID || updatedRow.UserID;

          setRows((prev) =>
            prev.map((row) => (getRowId(row) === ID ? updatedRow : row))
          );
        } else {
          console.error("User creation failed");
        }
      }
    }
    if (choice === "stock") {
      if (updatedRow?.isNew) {
        if (!updatedRow.Name || updatedRow.Quantity === undefined) {
          console.warn("Missing required fields");
          return;
        }

        // build payload exactly as postStock expects (single object)
        const newStock = {
          Name: updatedRow.Name,
          Quantity: Number(updatedRow.Quantity),
          SourceName: updatedRow.SourceName ?? null,
          Price: Number(updatedRow.Price) || 0,
        };

        // post to backend
        const createdStock = await postStock(newStock);
        await refreshAll();

        // mark row as no longer new; copy any server IDs back into the row
        updatedRow.isNew = false;
        if (createdStock?.ID) {
          updatedRow.ID = createdStock.ID;
        }

        setRows((prev) =>
          prev.map((row) => (getRowId(row) === ID ? updatedRow : row))
        );
      } else {
        // update existing stock if needed
        const updatedStock = {
          ...updatedRow,
          Quantity: Number(updatedRow.Quantity),
          Price: Number(updatedRow.Price) || 0,
        };

        await updateStock(updatedStock);
        await refreshAll();
      }
    }
  };

  // Delete -- not testes since if product is deletd then wont be able to added it due to backend issue
  const handleDeleteClick = (ID) => async () => {
    let success = false;

    if (choice === "patrons") {
      success = await tryDeletePatron(ID);
    } else if (choice === "users") {
      success = await tryDeleteUser(ID);
    } else if (choice === "products") {
      success = await tryDeleteProduct(ID);
    } else if (choice === "stock") {
      success = await tryDeleteStock(ID);
    }

    if (success) {
      setRowModesModel((prev) => {
        const newModel = { ...prev };
        delete newModel[ID];
        return newModel;
      });

      setRows((prevRows) => prevRows.filter((row) => getRowId(row) !== ID));
    } else {
      console.error(`Failed to delete ${choice.slice(0, -1)} with ID ${ID}`);
    }
  };

  // cancel edit operation
  const handleCancelClick = (ID) => () => {
    setRowModesModel({
      ...rowModesModel,
      [ID]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  //row update
  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow };

    setRows((prevRows) =>
      prevRows.map((row) =>
        getRowId(row) === getRowId(updatedRow) ? updatedRow : row
      )
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // async and await needed to let the table get upadted and the request take time. when I ran request without them it gave errors as the request wasnt completed.
  useEffect(() => {
    const fetchData = async () => {
      if (loadingSession) return; // waiting for the session to load

      if (!isAuthenticated || userInfo?.name?.includes("@")) {
        console.warn("Unauthorized access to dashboard");
        console.log("Session state:", {
          isAuthenticated,
          userInfo,
          loadingSession,
        });
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        let data = [];

        if (choice === "products") {
          data = await getProductPageWithGenre();
          console.log("product", data);
        } else if (choice === "stock") {
          data = await getMergedData();
        } else if (choice === "patrons") {
          const response = await getPatron();
          console.log("Patron data sample:", response.list?.[0]);
          data = response.list;
        } else if (choice === "order") {
          data = await getOrder();
          console.log("Order data sample:", data);
        } else if (choice === "users") {
          const response = await getUser();
          console.log("User data sample:", response.list?.[0]);
          data = response.list;
        }

        setRows(data);
      } catch (error) {
        console.error("Error loading data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [choice, isAuthenticated, userInfo, loadingSession]);

  let columns = [];

  //product columns
  if (choice === "products") {
    columns = [
      {
        field: "ID",
        headerName: "ProductId",
        type: "string",
        width: 180,
        editable: false,
      },
      {
        field: "Name",
        headerName: "Name",
        type: "string",
        width: 180,
        editable: true,
      },
      {
        field: "SubGenre",
        headerName: "SubGenre",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "Author",
        headerName: "Author",
        type: "string",
        width: 180,
        editable: true,
      },
      {
        field: "Description",
        headerName: "Description",
        type: "string",
        width: 180,
        editable: true,
      },
      {
        field: "GenreName",
        headerName: "Genre Name",
        width: 180,
        editable: false,
      },
    ];
  }
  //stock columns
  if (choice === "stock") {
    columns = [
      {
        field: "ItemId",
        headerName: "ItemId",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "Quantity",
        headerName: "Quantity",
        type: "number",
        width: 180,
        editable: true,
      },
      { field: "Name", headerName: "Name", width: 180, editable: true },
      {
        field: "Price",
        headerName: "Price",
        type: "number",
        width: 180,
        editable: true,
      },

      {
        field: "SourceName",
        headerName: "Source Name",
        type: "string",
        width: 180,
        editable: true,
      },
    ];
  }
  //patrons columns
  if (choice === "patrons") {
    columns = [
      {
        field: "UserID",
        headerName: "UserID",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "Email",
        headerName: "Email",
        type: "string",
        width: 180,
        editable: true,
      },
      {
        field: "Name",
        headerName: "Name",
        type: "string",
        width: 180,
        editable: true,
      },
    ];
  }
  //users columns
  if (choice === "users") {
    columns = [
      {
        field: "UserID",
        headerName: "UserID",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "Email",
        headerName: "Email",
        type: "string",
        width: 180,
        editable: true,
      },
      {
        field: "Name",
        headerName: "Name",
        type: "string",
        width: 180,
        editable: true,
      },

      {
        field: "UserName",
        headerName: "UserName",
        type: "string",
        width: 180,
        editable: true,
      },
    ];
  }

  if (choice === "order") {
    columns = [
      {
        field: "OrderID",
        headerName: "OrderID",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "ItemId",
        headerName: "ItemId",
        type: "number",
        width: 180,
        editable: false,
      },
      {
        field: "StreetAddress",
        headerName: "StreetAddress",
        type: "string",
        width: 180,
        editable: false,
      },
      {
        field: "PostCode",
        headerName: "PostCode",
        type: "number",
        width: 180,
        editable: false,
      },

      {
        field: "Suburb",
        headerName: "Suburb",
        type: "string",
        width: 180,
        editable: false,
      },
    ];
  }

  // pushing the action items ---edit, save, delete--from MUI
  columns.push({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ];
    },
  });

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": { color: "text.secondary" },
        "& .textPrimary": { color: "text.primary" },
      }}
    >
      {/*loading condition added and circular progress added for feedabck and allow the render to happen */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{ toolbar: { setRows, setRowModesModel, choice } }}
          showToolbar={true}
        />
      )}
    </Box>
  );
}
