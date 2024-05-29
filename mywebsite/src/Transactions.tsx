import React from 'react';
import { Transaction } from './Types'; 

interface TransactionProps {
transaction: Transaction;
}

const TransactionComponent: React.FC<TransactionProps> = ({ transaction }) => {
    const { id, amount, categories, descriptions, dates } = transaction;
    let a = Number(amount.value.unscaledValue) * Number(amount.value.scale)
    var name = descriptions?.display
    if (name != null && name.length > 20){
        name = name.substring(0,20) + '...'
    }
    const amountClass = a >= 0 ? 'positive' : 'negative';

    return (
        <div key={id} className="transaction-item">
        <p className='transaction-name'>{name}</p>
        <p className={`transaction-amount ${amountClass}`}>{a} {amount.currencyCode}</p>
        <p> {dates?.transaction} </p>
        <p> {categories?.pfm.id}</p>
        </div>
    );
};

interface TransactionsListProps {
transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
return (
    <div className="transactions-list">
    {transactions.map(transaction => (
        <TransactionComponent key={transaction.id} transaction={transaction} />
    ))}
    </div>
);
};

export default TransactionsList;