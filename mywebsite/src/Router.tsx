import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App';
import CallbackPage from './CallbackPage';

const RouteManager: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={App} />
                <Route path="/callback" Component={CallbackPage} />
            </Routes>
        </Router>
    );
};

export default RouteManager;