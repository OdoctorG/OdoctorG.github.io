import { Fragment } from "react";

interface TabsProps {
    selectedMonth: number;
    selectedYear: number;
    currentYear: number;
    currentMonth: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
}

const Tabs: React.FC<TabsProps> = ({
    selectedMonth,
    selectedYear,
    currentYear,
    currentMonth,
    onMonthChange,
    onYearChange
  }) => {
    const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <div className="tabs">
        <div className="years">
            <button onClick={() => onYearChange(selectedYear - 1)}>Previous Year</button>
                <span>{selectedYear}</span>
                <button
                onClick={() => onYearChange(selectedYear + 1)}
                className={selectedYear >= currentYear ? 'hidden' : ''}
                >
                Next Year
            </button>
        </div>
        <div className="months">
            {months.map((month, index) => (
            (selectedYear < currentYear || index <= currentMonth) && (<Fragment key={index}>
                <button
                    onClick={() => onMonthChange(index)}
                    className={selectedMonth === index ? 'active' : ''}
                >
                    {month}
                </button>
                {month === 'Jun' && <hr />} {/* Insert <hr> after June */}
            </Fragment>
            )))}
        </div>
        </div>
    );
};

export default Tabs;