import ExampleComponent from "../components/getData";
import { DataProvider } from "../contexts/DataProvider";


const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <ExampleComponent />
    </div>
  );
};

export default HomePage;
