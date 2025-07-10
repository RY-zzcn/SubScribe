import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// 格式化金额
export function formatCurrency(amount, currency = 'CNY') {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  })
  
  return formatter.format(amount)
}

// 格式化日期
export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

// 计算周期显示
export function formatCycle(cycle) {
  if (!cycle) return ''
  
  const unitMap = {
    day: '天',
    week: '周',
    month: '月',
    year: '年'
  }
  
  return `每${cycle.value}${unitMap[cycle.unit]}`
}

// 计算下次付款日期
export function calculateNextPaymentDate(firstPaymentDate, cycle) {
  if (!firstPaymentDate || !cycle) return null
  
  const firstPayment = new Date(firstPaymentDate)
  const now = new Date()
  let nextPayment = new Date(firstPayment)
  
  while (nextPayment <= now) {
    switch (cycle.unit) {
      case 'day':
        nextPayment.setDate(nextPayment.getDate() + cycle.value)
        break
      case 'week':
        nextPayment.setDate(nextPayment.getDate() + (cycle.value * 7))
        break
      case 'month':
        nextPayment.setMonth(nextPayment.getMonth() + cycle.value)
        break
      case 'year':
        nextPayment.setFullYear(nextPayment.getFullYear() + cycle.value)
        break
    }
  }
  
  return nextPayment
}

// 计算剩余天数
export function calculateDaysUntil(date) {
  if (!date) return null
  
  const targetDate = date instanceof Date ? date : new Date(date)
  const now = new Date()
  
  // 重置时间部分，只比较日期
  targetDate.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  
  const diffTime = targetDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// 生成随机ID
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
} 