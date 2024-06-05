import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Treemap,  ResponsiveContainer} from 'recharts';
import { Transaction } from './Types';

function parseDateFromString(dateString: string): Date | null {
    const months: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const parts = dateString.split(' ');
    if (parts.length !== 2) {
        return null; // Invalid format
    }

    const month = months[parts[0]];
    const year = parseInt(parts[1], 10);

    if (isNaN(month) || isNaN(year)) {
        return null; // Invalid month or year
    }

    return new Date(year, month);
}


// Custom label rendering function for pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1 + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
    <g>
        <rect x={x - 30} y={y - 20} width={60} height={40} fill="black" opacity={0.5} rx={5} ry={5} />
        <text x={x} y={y - 5} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {name}
        </text>
        <text x={x} y={y + 15} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    </g>
    );
};

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#A28A76', '#C28B57', '#84A9AC', '#BFD7EA'
];

interface ExpensesGraphProps {
    transactions: Transaction[];
    selectedYear: number;
}

const ExpensesGraph: React.FC<ExpensesGraphProps> = ({ transactions, selectedYear }) => {
    // Calculate total expenses per month
    const expensesPerMonth = transactions.reduce((acc, transaction) => {
        const { amount, dates, types } = transaction;
        const value = Math.round(Number(amount.value.unscaledValue) * 10 ** -Number(amount.value.scale));

        if (value < 0 && types.type == "EXPENSES" && types.financialInstitutionTypeCode != "Transfer" && dates?.booked != null) {
            
            const date = new Date(dates.booked);
            const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear] += value;
        }

        return acc;
    }, {} as Record<string, number>)

    const incomePerMonth = transactions.reduce((acc, transaction) => {
        const { amount, dates, types } = transaction;
        const value = Math.round(Number(amount.value.unscaledValue) * 10 ** -Number(amount.value.scale));

        if (value > 0 && types.type == "INCOME" && types.financialInstitutionTypeCode != "Transfer" && dates?.booked != null) {
            
            const date = new Date(dates.booked);
            const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear] += value;
        }

        return acc;
    }, {} as Record<string, number>)

    var total = 0;

    const perCategory = transactions.reduce((acc, transaction) => {
        const { amount, dates, types } = transaction;
        const value = Math.round(Number(amount.value.unscaledValue) * 10 ** -Number(amount.value.scale));
        
        if (value < 0 && types.type == "EXPENSES" && types.financialInstitutionTypeCode != "Transfer" && dates?.booked != null) {
            const cat = transaction.categories?.pfm.name.split(':')[0] // Get major category
            const date = new Date(dates.booked); // Get date

            if (cat != null && date.getFullYear() == selectedYear){
                if (!acc[cat]) {
                    acc[cat] = 0;
                }
                acc[cat] += value;
                total += Math.abs(value);
            }
            
        }

        return acc;
    }, {} as {[key: string]: number})

    

    // Convert the data into a format suitable for recharts and sort by date
    const data = Object.keys(expensesPerMonth).reverse()
        .map(monthYear => {
        const date = parseDateFromString(monthYear); // Parse the monthYear string back to a Date object
        return {
            monthYear,
            expenses: Math.abs(expensesPerMonth[monthYear]), // Make expenses positive for display
            income: Math.abs(incomePerMonth[monthYear]),
            date
        };
        })
        .filter(item => {
            if (item.date != null && item.date.getFullYear() == selectedYear){
                return true
            }
            return false
        });

    const piedata = Object.keys(perCategory)
        .map(cat => {
            return {
                name: cat,
                value: Math.abs(perCategory[cat])
            };
        })

    // Custom content component for TreeMap
    const CustomContent: React.FC<any> = (props) => {
        const { depth, x, y, width, height, index, name, value } = props;

        // Hide small categories (e.g., size < 5% of the largest size)
        const maxSize = Math.max(...piedata.map(d => d.value));
        if (value < maxSize * 0.05) return null;

        return (
        <g>
            <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
                fill: COLORS[index % COLORS.length],
                stroke: '#fff',
                strokeWidth: 2,
            }}
            />
            {depth === 1 ? (
            <text
                x={x + width / 2}
                y={y + height / 2 - 10}
                textAnchor="middle"
                fill="#fff"
                fontSize={12}
                fontWeight="bold"
            >
                {name}
            </text>
            ) : null}
            {depth === 1 ? (
            <text
                x={x + width / 2}
                y={y + height / 2 + 10}
                textAnchor="middle"
                fill="#fff"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(value / total * 100).toFixed(0)}%`}
            </text>
            ) : null}
        </g>
        );
    };

    return (
        <div className="graph_container">
        <header>
            <h2>Expenses/income for {selectedYear}</h2>
        </header>
        <ResponsiveContainer width="100%" aspect={1.5}>
        <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthYear" />
            <YAxis />
            <Tooltip
                    contentStyle={{ color: 'black', backgroundColor: 'white' }}
                />
            <Legend />
            <Bar dataKey="expenses" fill="#F44336" />
            <Bar dataKey="income" fill="#4CAF50" />
        </BarChart>
        </ResponsiveContainer>
        <header>
            <h2>Expenses per category ({selectedYear})</h2>
        </header>
        
        <ResponsiveContainer width="100%" aspect={1}>
        <Treemap
            data={piedata}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomContent />}
        >
            {piedata.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Tooltip
            content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const { name, value } = payload[0].payload;
                return (
                <div style={{ background: '#fff', color: 'black', padding: '5px', border: '1px solid #ccc' }}>
                    <p>{name}</p>
                    <p>{`Amount: ${value}`}</p>
                </div>
                );
            }}
            />
            <Legend
            payload={piedata.map((item, index) => ({
                value: item.name,
                type: 'square',
                color: COLORS[index % COLORS.length],
            }))}
            />
        </Treemap>
        </ResponsiveContainer>

        </div>
    );
};

export default ExpensesGraph;