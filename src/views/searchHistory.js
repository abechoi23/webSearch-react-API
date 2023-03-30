import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/DataProvider";
import { collectionGroup, query, getDocs } from "@firebase/firestore";
import { db } from "../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

export default function SearchHistory() {
  const [data, setData] = useState();

  const getPosts = async () => {
    const postQuery = query(collectionGroup(db, "search"));
    const querySnapshot = await getDocs(postQuery);
    const loadedPosts = [];
    querySnapshot.forEach((doc) => {
      loadedPosts.push({ ...doc.data() });
      setData(loadedPosts);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  console.log(data);

  // Create component SearchHistory in /components
  // Create MUI Table

  // List MUI Table here
  // Map through data, and list of all the items
  return (
    <>
      <Typography variant="h5">Search History</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Search History</TableCell>
              <TableCell>Date Searched</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.searchQuery}</TableCell>
                  <TableCell>{new Date(row.dateCreated.seconds * 1000).toLocaleDateString('en-US')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
