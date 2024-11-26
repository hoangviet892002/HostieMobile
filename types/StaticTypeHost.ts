interface Income {
  this_year: number;
  last_year: number;
}

interface dataIncome {
  data: Income[];
}

export interface StaticTypeHost {
  total_residence: number;
  total_butler: number;
  total_commission: number;
  total_revenue: number;
  income_by_month: dataIncome[];
}
