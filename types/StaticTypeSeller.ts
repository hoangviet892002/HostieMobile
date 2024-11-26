interface Income {
  this_year: number;
  last_year: number;
}

interface dataIncome {
  data: Income[];
}

export interface StaticTypeSeller {
  total_sold: number;
  total_commission: number;
  total_revenue: number;
  income_by_month: dataIncome[];
}
