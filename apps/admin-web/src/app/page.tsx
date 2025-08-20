import Link from 'next/link'
import { 
  Users, 
  FileText, 
  Package, 
  ShoppingCart, 
  Truck, 
  Calendar,
  BarChart3,
  Shield
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '12,345', change: '+12%', icon: Users },
    { name: 'Health Guides', value: '89', change: '+3%', icon: FileText },
    { name: 'Products', value: '234', change: '+8%', icon: Package },
    { name: 'Orders Today', value: '67', change: '+15%', icon: ShoppingCart },
  ]

  const quickActions = [
    { name: 'Health Guides', href: '/health-guides', icon: FileText, color: 'bg-blue-500' },
    { name: 'Products', href: '/products', icon: Package, color: 'bg-green-500' },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, color: 'bg-purple-500' },
    { name: 'Deliveries', href: '/deliveries', icon: Truck, color: 'bg-orange-500' },
    { name: 'Providers', href: '/providers', icon: Calendar, color: 'bg-teal-500' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'bg-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Health SuperApp Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome back, Admin</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Manage your health platform</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="group relative rounded-lg p-6 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-500">Manage {action.name.toLowerCase()}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'New health guide published', time: '2 minutes ago', type: 'guide' },
                { action: 'Product stock updated', time: '15 minutes ago', type: 'product' },
                { action: 'New order received', time: '1 hour ago', type: 'order' },
                { action: 'Provider verified', time: '2 hours ago', type: 'provider' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
