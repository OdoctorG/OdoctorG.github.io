import React from 'react';
import { AppData } from './AppData';
import { useState, useEffect } from 'react'

import ExpensesGraph from './ExpensesGraph';
import TransactionsList from './Transactions'; // Assuming TransactionsList component is in TransactionsList.tsx
import Tabs from './Tabs';
import { ListTransactionsResponse, Transaction } from './Types';
import { ListCategoriesResponse } from './Types';

const API_URL = 'https://main.websited26df17a-review.myrnastet.coherencesites.com/';

export const fetchTransactions = async (accessToken: string): Promise<ListTransactionsResponse> => {
    const response = await fetch(API_URL + 'transactions', {
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

export const fetchCategories = async (loacle: string): Promise<ListCategoriesResponse> => {
    let URL = API_URL + 'categories?' + new URLSearchParams({locale: loacle})
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    const data: ListCategoriesResponse = await response.json();
    return data;
};

// Fill the category name with the one matching the category id
function populateCategories(transactions: Transaction[], categoryDict: { [key: string]: Array<string> }){
    window.console.log(transactions)
    for (var transaction of transactions){
        if (transaction.categories?.pfm.id != null && transaction.categories?.pfm.id in categoryDict){
            transaction.categories.pfm.name = categoryDict[transaction.categories?.pfm.id][0]
            transaction.types.type = categoryDict[transaction.categories?.pfm.id][1]
        }
    }
}

const Overview: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    var [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchCalled, setFetchCalled] = useState<boolean>(false);
    const [catSet, SetCatSet] = useState<boolean>(false)
    const [categoryDict, setCategoryDict] = useState<{ [key: string]: Array<string> } >({});
    
    const accessToken = AppData.getAccessToken();
    
    if (accessToken == null){
        return <div>Error: No access token</div>
    }

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
    };
    
    const handleYearChange = (year: number) => {
        setSelectedYear(year);
            // Adjust month if the selected year is the current year
        if (year === currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth);
        }
    };

    useEffect(() => {
        const getTransactions = async () => {
            try {
                var response = await fetchTransactions(accessToken.access_token);
                populateCategories(response.transactions, categoryDict)
                setTransactions(response.transactions);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
                setFetchCalled(true);
            }
        };

        const getCategories = async () => {
            try {
                let locale = navigator.language
                const response = await fetchCategories(locale);
                var dict: { [key: string]: Array<string> } = {}
                for (var cat of response){
                    if (cat.secondaryName != null && cat.primaryName != null){
                        dict[cat.id] = [cat.primaryName + ' : ' + cat.secondaryName, cat.type]
                    }
                    else {
                        dict[cat.id] = [cat.code, cat.type]
                    }
                    
                }
                setCategoryDict(dict)
            } catch (error) {
                setError((error as Error).message);
            }
        }

        if (!fetchCalled) {
            getCategories()
            getTransactions() // Make sure we only call it once
            
        }
        if (!catSet && transactions.length > 0){
            populateCategories(transactions, categoryDict)
            SetCatSet(true)
        }
        
    }, [accessToken, fetchCalled, categoryDict]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='overview_container'>
            <div className="container_trans">
                <header>
                    <h1>Transactions</h1>
                </header>
                <Tabs
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                />
                <TransactionsList
                    transactions={transactions}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
                
            </div>
            <ExpensesGraph 
                transactions={transactions} 
                selectedYear={selectedYear}    
            />
        </div>
    );
    
}

export default Overview