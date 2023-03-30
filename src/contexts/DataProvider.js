import { useState, useEffect, createContext, useContext } from "react";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  collectionGroup,
  query,
  updateDoc,
  setDoc
} from "@firebase/firestore";
import { AuthContext } from "./AuthProvider";
import { db } from "../firebase";
import axios from "axios";
import uuid from 'react-uuid';


export const DataContext = createContext();

export const DataProvider = function (props) {
  const [searchData, setSearchData] = useState([]);
  const { user } = useContext(AuthContext);
  const apiKey = process.env.REACT_APP_RAPID_API_KEY
  console.log(searchData);

  useEffect(() => {
    // This query gets data from firebase
    // should be in same component where its needed
    async function getPosts() {
      const postQuery = query(collectionGroup(db, "search"));
      const querySnapshot = await getDocs(postQuery);
      const loadedPosts = [];
      querySnapshot.forEach((doc) => {
        loadedPosts.push({...doc.data()});
      });
      setSearchData(loadedPosts);
    }
    getPosts();
  }, []);

  async function getPost(uid, id) {
    const docRef = doc(db, "search", uid, "searches", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Throw an error, so that the catch is triggered in PostSingle
      throw new Error();
    }
    return docSnap.data();
  }

  async function getData(searchQuery) {
    const options = {
      method: "GET",
      url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI",
      params: {
        q: searchQuery,
        pageNumber: "1",
        pageSize: "1",
        autoCorrect: "true",
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function addPost(data) {
    const newPost = {
      searchQuery: data.value[0].title,
      dateCreated: Timestamp.now(),
      username: user.displayName,
      uid: user.uid,
      id: uuid()
    };
    try {
      const docRef = await addDoc(
        collection(db, "search"),
        newPost
      );
      console.log(docRef)
      newPost.id = docRef.id;

      setSearchData([...searchData, newPost]);

      return newPost;
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    searchData,
    getPost,
    getData,
    addPost,
  };

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
};
