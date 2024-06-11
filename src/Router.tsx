import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import CallbackPage from './pages/CallbackPage';
import Overview from './pages/Overview';

// const RouteManager: React.FC = () => {
//     return (
//         <HashRouter>
//             <Routes>
//                 <Route path="/" Component={App} />
//                 <Route path="/callback" Component={CallbackPage} />
//                 <Route path="/overview" Component={Overview} />
//             </Routes>
//         </HashRouter>
//     );
// };

const RouteManager: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="/overview" element={<Overview />} />
            </Routes>
        </HashRouter>
    );
};

export default RouteManager;