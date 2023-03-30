import { useEffect, useState, useContext } from "react";
import { DataContext } from "../contexts/DataProvider";

const ExampleComponent = () => {
  const { getData, addPost } = useContext(DataContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await getData(searchQuery);
    setData(response);
    console.log("handleSubmit called");
  
    try {
      await addPost(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery !== "") {
        const response = await getData(searchQuery);
        setData(response);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Search:</label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {isLoading ? (
        <p>Loading data...</p>
      ) : data && data.value ? (
        <ul>
          {data.value.map((item) => (
            <li key={item.url}>
              <a href={item.url}>{item.title}</a>
              <p>{item.description}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  width="200"
                  height="200"
                />
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default ExampleComponent;
