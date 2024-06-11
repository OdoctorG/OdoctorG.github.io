import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App';
import CallbackPage from './pages/CallbackPage';
import Overview from './pages/Overview'

const RouteManager: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={App} />
                <Route path="/callback" Component={CallbackPage} />
                <Route path="/overview" Component={Overview} />
            </Routes>
        </Router>
    );
};

export default RouteManager;