import './index.css'
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import App from "./App.tsx";

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/game/:gameSessionId" element={<App/>}/>
        </Routes>
    </BrowserRouter>
);
