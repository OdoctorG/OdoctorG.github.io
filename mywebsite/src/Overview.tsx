import React from 'react';
import { AppData } from './AppData';
import { useState, useEffect } from 'react'

import TransactionsList from './Transactions'; // Assuming TransactionsList component is in TransactionsList.tsx
import { ListTransactionsResponse, Transaction } from './Types';

const API_URL = 'http://localhost:8000/transactions';

export const fetchTransactions = async (accessToken: string): Promise<ListTransactionsResponse> => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }

    const data: ListTransactionsResponse = await response.json();
    return data;
};

const Overview: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchCalled, setFetchCalled] = useState<boolean>(false);
    
    const accessToken = AppData.getAccessToken();
    
    if (accessToken == null){
        return <div>Error: No access token</div>
    }
    
    window.console.log(accessToken)

    useEffect(() => {
        const getTransactions = async () => {
        try {
            const response = await fetchTransactions(accessToken.access_token);
            setTransactions(response.transactions);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
            setFetchCalled(true);
        }
        };

        if (!fetchCalled) {
            getTransactions(); // Make sure we only call it once
        }
        
    }, [accessToken, fetchCalled]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return (
        <div>
        <h1>Transactions</h1>
        <TransactionsList transactions={transactions} />
        </div>
    );
    
}

export default Overview