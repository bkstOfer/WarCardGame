import Player from "./components/player/player";
import PlayingTable from "./components/playing-table/playingTable";
import AppProvider from "./context/appProvider";
import styled from "styled-components";

const App = () => {
    const AppContainer = styled.div`
        height: inherit;
        width: inherit;
        display: flex;
        justify-content: space-around;
        align-items: center;
    `;

    return (
        <AppContainer>
            <AppProvider>
                <Player name="Player" id={1} />
                <PlayingTable />
                <Player name="PC" id={2} />
            </AppProvider>
        </AppContainer>
    )
}

export default App;