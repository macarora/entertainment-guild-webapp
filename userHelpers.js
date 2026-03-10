import axios from "axios";

const API_PREFIX_SHORT = "http://localhost:3001";
const API_PREFIX_LONG = API_PREFIX_SHORT + "/api/inft3050";

/* Axios database calls */

//Login user
const tryLoginUser = async (username, password, setResult) => {
  const headers = {
    Accept: "application/json",
  };

  try {
    const response = await axios.post(
      API_PREFIX_SHORT + "/login",
      { username, password },
      {
        headers,
        withCredentials: true,
      }
    );

    console.log(response, username, password);
    setResult("Success!");
    return response.data;
  } catch (error) {
    console.log(error);
    setResult("Error");
    return null;
  }
};

//Patron Login --using get request fro patron login and not post as it not working for patron--using email as thats what the backend sends and uses for patron
const tryLoginPatron = async (email, password, setResult) => {
  try {
    //getPatron list
    const response = await axios.get(`${API_PREFIX_LONG}/Patrons`);
    const patrons = response.data.list || [];

    //match by email
    const matchedPatron = patrons.find(
      (p) => p.Email?.toLowerCase() === email.toLowerCase()
    );

    if (!matchedPatron) {
      setResult("Patron not found.");
      return null;
    }

    // hash password with patron salt
    const hashedPassword = await sha256(matchedPatron.Salt + password);

    // compare hash
    if (hashedPassword !== matchedPatron.HashPW) {
      setResult("Incorrect password.");
      return null;
    }

    // validation
    setResult("Success!");
    return {
      userId: matchedPatron.UserID,
      name: matchedPatron.Email,
      email: matchedPatron.Email,
    };
  } catch (error) {
    console.error("Error during patron login:", error);
    setResult("Error");
    return null;
  }
};

//SHA256 password hashing
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Generate a random salt: a 32-character hex string
const generateSalt = () => {
  const salt = window.crypto.randomUUID().replaceAll("-", "");
  return salt;
};

//Add new user
const tryAddNewUser = async (username, password, name, email, setResult) => {
  try {
    // Set up headers for API request
    const headers = { Accept: "application/json" };

    // Generate salt and hash the password
    const salt = generateSalt();
    const hash = await sha256(salt + password);

    // Create user credentials
    const newCredentials = {
      UserName: username,
      Email: email,
      Name: name,
      IsAdmin: "false",
      Salt: salt,
      HashPW: hash,
    };

    // Send POST request to backend
    const response = await axios.post(
      `${API_PREFIX_LONG}/User`,
      newCredentials,
      {
        headers,
        withCredentials: true,
      }
    );

    console.log("Added user successfully", response);
    setResult?.("Success");
    return response.data; // Return created user data
  } catch (error) {
    console.error("Error posting data:", error.response?.data || error);
    setResult?.("Fail");
    return null;
  }
};

//Add new patron
const tryAddPatron = async (email, name, password, setResult) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
  };

  const salt = generateSalt();
  const hash = await sha256(salt + password);

  const newPatron = {
    Email: email,
    Name: name,
    Salt: salt,
    HashPW: hash,
  };

  console.log("Creating patron with:", newPatron);

  try {
    const response = await axios.post(`${API_PREFIX_LONG}/Patrons`, newPatron, {
      headers,
      withCredentials: true,
    });

    console.log("Patron created:", response.data);
    setResult("Success");

    //
    const allPatrons = await axios.get(
      "http://localhost:3001/api/inft3050/Patrons"
    );
    // matching the values
    const match = allPatrons.data.list.find((p) => {
      const isEmailMatch = p.Email?.toLowerCase() === email.toLowerCase();
      const isHashMatch = p.HashPW === hash;
      const isSaltMatch = p.Salt === salt;
      return isEmailMatch && isHashMatch && isSaltMatch;
    });

    if (match) {
      console.log("Hash validation successful for:", match.Email);
    } else {
      console.warn("Hash mismatch — something went wrong.");
    }
  } catch (error) {
    console.error("Error creating patron:", error.response?.data || error);
    setResult("Fail");
  }
};

//delete patron
const tryDeletePatron = async (userID) => {
  try {
    const response = await axios.delete(
      `${API_PREFIX_LONG}/Patrons/${userID}`,
      {
        withCredentials: true,
      }
    );
    console.log(`Patron ${userID} deleted`, response.data);
    return true;
  } catch (error) {
    console.error("Error deleting patron:", error.response?.data || error);
    return false;
  }
};

//delete user -- was working for scrum-- some backend issue causing errors--untested now
const tryDeleteUser = async (userID) => {
  try {
    const response = await axios.delete(`${API_PREFIX_LONG}/User/${userID}`, {
      withCredentials: true,
    });
    console.log(`User ${userID} deleted`, response.data);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error);
    return false;
  }
};

//delete product-- untested--backened issues
const tryDeleteProduct = async (productID) => {
  try {
    const response = await axios.delete(
      `${API_PREFIX_LONG}/Product/${productID}`,
      {
        withCredentials: true,
      }
    );
    console.log(`Product ${productID} deleted`, response.data);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error);
    return false;
  }
};

//delete stock -- untested--backend issues
const tryDeleteStock = async (stockID) => {
  try {
    const response = await axios.delete(
      `${API_PREFIX_LONG}/Product/${stockID}`,
      {
        withCredentials: true,
      }
    );
    console.log(`Product ${stockID} deleted`, response.data);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error);
    return false;
  }
};

export {
  tryAddNewUser,
  tryLoginUser,
  tryLoginPatron,
  tryAddPatron,
  tryDeletePatron,
  tryDeleteUser,
  tryDeleteProduct,
  tryDeleteStock,
};
