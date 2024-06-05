import React, { useEffect, useRef, useState } from 'react';
import { Transaction } from './Types'; 

interface TransactionProps {
transaction: Transaction;
}

const TransactionComponent: React.FC<TransactionProps> = ({ transaction }) => {
    const { id, amount, categories, descriptions, dates } = transaction;
    let a = Math.round(Number(amount.value.unscaledValue) * 10 ** -Number(amount.value.scale))
    
    var name = descriptions?.display
    if (name != null && name.length > 20){
        name = name.substring(0,20) + '...'
    }
    const amountClass = a >= 0 ? 'positive' : 'negative';

    return (
        <div key={id} className="transaction-item">
        <p className='transaction-name'>{name}</p>
        <p className={`transaction-amount ${amountClass}`}>{a} {amount.currencyCode}</p>
        <p className="break"></p>
        <p className={'transaction-date'}> {dates?.booked} </p>
        <p className={'transaction-category'}> {categories?.pfm.name} </p>
        </div>
    );
};

interface TransactionsListProps {
    transactions: Transaction[]
    selectedMonth: number
    selectedYear: number
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, selectedMonth, selectedYear }) => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio === 1) {
                        entry.target.classList.add('new-item');
                    } else {
                        entry.target.classList.remove('new-item');
                    }
                });
            },
            { threshold: 1 }
        );

        const items = listRef.current?.querySelectorAll('.transaction-item');
        items?.forEach(item => {
            observer.observe(item);
        });

        return () => {
            items?.forEach(item => observer.unobserve(item));
        };
    }, [transactions, selectedMonth, selectedYear]);

    const filteredTransactions = transactions.filter(transaction => {
        const transdate = transaction.dates?.booked
        if (transdate != null){
            const date = new Date(transdate);
            return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        }
    });

    return (
        <div className="transactions-list" ref={listRef}>
        {filteredTransactions.map(transaction => (
            <TransactionComponent key={transaction.id} transaction={transaction}/>
        ))}
        </div>
    );
};

export default TransactionsList;