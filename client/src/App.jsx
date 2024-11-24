import { AdWrapper } from "./components/AdWrapper/AdWrapper";
import "./App.css";

const App = () => {
	const localList = JSON.parse(localStorage.getItem("adList"));
	return (
		<>
			<AdWrapper list={localList} />
		</>
	);
};

export default App;
