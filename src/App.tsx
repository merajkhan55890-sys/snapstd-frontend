import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DocumentDetail from './pages/DocumentDetail';
import AI from './pages/AI';
import Library from './pages/Library';
import Settings from './pages/Settings';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/ai" element={<AI />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Routes without standard layout if needed, but for now specific page can hide Nav */}
                    <Route path="/file/:id" element={<DocumentDetail />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
