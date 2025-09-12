// Константы приложения

export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  INCOME: 'income',
  EXPENSE: 'expense'
}

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.ASSET]: 'Активы',
  [ACCOUNT_TYPES.LIABILITY]: 'Пассивы',
  [ACCOUNT_TYPES.INCOME]: 'Доходы',
  [ACCOUNT_TYPES.EXPENSE]: 'Расходы'
}

export const DEFAULT_ACCOUNTS = [
  { code: '10', name: 'Касса', type: 'asset' },
  { code: '41', name: 'Расчетный счет', type: 'asset' },
  { code: '43', name: 'Товары на складе', type: 'asset' },
  { code: '60', name: 'Расчеты с поставщиками', type: 'liability' },
  { code: '70', name: 'Расчеты с персоналом', type: 'liability' },
  { code: '90', name: 'Продажи', type: 'income' },
  { code: '20', name: 'Закупки', type: 'expense' },
  { code: '44', name: 'Прочие расходы', type: 'expense' }
]

export const DATE_FORMAT = 'YYYY-MM-DD'

export const CURRENCY_SYMBOL = '₽'

export const PAGE_TITLES = {
  LOGIN: 'Вход в систему',
  DASHBOARD: 'Дашборд',
  TRANSACTIONS: 'Проводки',
  ACCOUNTS: 'Счета',
  COUNTERPARTIES: 'Контрагенты',
  CHESS_REPORT: 'Шахматная ведомость'
}