import Map from "./components/Map";
import { useAuth } from "./context/useAuth";

function App() {
  const { user, isLoading } = useAuth();

  console.log({ user, isLoading });

  return (
    <>
      <Map />
    </>
  );
}

export default App;
