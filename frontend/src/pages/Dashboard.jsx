import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  DollarSign,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useSubscriptionsStore } from '@/store/subscriptionsStore'
import { formatCurrency, formatDate } from '@/lib/utils'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function Dashboard() {
  const { subscriptions, loading, getSubscriptionStats, getUpcomingSubscriptions } = useSubscriptionsStore()
  const [stats, setStats] = useState(null)
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([])
  const [statsLoading, setStatsLoading] = useState(false)

  const fetchDashboardData = async () => {
    setStatsLoading(true)
    try {
      const statsData = await getSubscriptionStats()
      const upcomingData = await getUpcomingSubscriptions()
      
      setStats(statsData)
      setUpcomingSubscriptions(upcomingData)
    } catch (error) {
      console.error('获取仪表盘数据失败:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (subscriptions.length > 0) {
      fetchDashboardData()
    }
  }, [subscriptions])

  if (loading || statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  // 准备图表数据
  const categoryData = stats?.categoryStats ? Object.entries(stats.categoryStats).map(([category, data]) => ({
    name: category,
    value: data.amount,
    count: data.count
  })) : []

  const monthlyTrendData = [
    { month: '1月', amount: stats?.monthlyTotal * 0.8 || 0 },
    { month: '2月', amount: stats?.monthlyTotal * 0.9 || 0 },
    { month: '3月', amount: stats?.monthlyTotal * 1.1 || 0 },
    { month: '4月', amount: stats?.monthlyTotal || 0 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-600 mt-1">欢迎回来，查看您的订阅概览</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总订阅数</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSubscriptions || 0}</div>
            <p className="text-xs text-muted-foreground">
              活跃订阅服务
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月度支出</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyTotal || 0)}</div>
            <p className="text-xs text-muted-foreground">
              每月订阅费用
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">年度支出</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.yearlyTotal || 0)}</div>
            <p className="text-xs text-muted-foreground">
              预计年度费用
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即将到期</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              需要续费的订阅
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>支出分类分布</CardTitle>
            <CardDescription>按分类查看订阅费用分布</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(value), '月度费用']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <CardHeader>
            <CardTitle>即将到期的订阅</CardTitle>
            <CardDescription>需要关注的续费提醒</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {upcomingSubscriptions.length > 0 ? (
                upcomingSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{subscription.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(subscription.price, subscription.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={subscription.daysUntilPayment <= 1 ? "destructive" : "secondary"}>
                        {subscription.daysUntilPayment === 0 ? '今天到期' : `${subscription.daysUntilPayment}天后`}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(subscription.nextPaymentDate)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无即将到期的订阅</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>支出趋势</CardTitle>
          <CardDescription>最近几个月的订阅费用趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), '费用']} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 