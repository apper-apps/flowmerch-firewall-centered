import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Products from '@/components/pages/Products'
import SyncManager from '@/components/pages/SyncManager'
import DescriptionEditor from '@/components/pages/DescriptionEditor'
import WidgetBuilder from '@/components/pages/WidgetBuilder'
import BundleManager from '@/components/pages/BundleManager'
import Collections from '@/components/pages/Collections'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sync" element={<SyncManager />} />
            <Route path="/descriptions" element={<DescriptionEditor />} />
            <Route path="/widgets" element={<WidgetBuilder />} />
            <Route path="/bundles" element={<BundleManager />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App