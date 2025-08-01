import { useState, useEffect } from 'react';
import customerService from '../../../api/customerService';
import transactionService from '../../../api/transactionService';
import { usePersonnelAuth } from '../../../shared/context/PersonnelAuthContext';

export const usePersonnelTransactionPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customer, setCustomer] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    
    const [transferDetails, setTransferDetails] = useState({
        amount: '',
        currency_code: '',
        transaction_category: '',
        transaction_subtype: '',
        description: '',
        source_account_iban: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { personnel } = usePersonnelAuth();

    useEffect(() => {
        if(success) {
            const timer = setTimeout(() => setSuccess(''), 6000);
            return () => clearTimeout(timer);
        }
        if(error) {
            const timer = setTimeout(() => setError(''), 6000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const resetSearchState = () => {
        setCustomer(null);
        setAccounts([]);
        setSelectedAccount(null);
        setError('');
        setTransferDetails({
            amount: '', currency_code: '',
            transaction_category: '', transaction_subtype: '', description: '',
            source_account_iban: '',
        });
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsLoading(true);
        resetSearchState();
        
        try {
            const data = await customerService.getCustomerByTckn(searchQuery);
            if (!data.success) throw new Error(data.message || 'Müşteri bulunamadı.');
            
            setCustomer(data.customer);
            setAccounts(data.accounts);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccountSelect = (account) => {
        setSelectedAccount(account);
        setTransferDetails(prev => ({ 
            ...prev,
            currency_code: account.currency_code 
        }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTransferDetails(prev => ({...prev, [name]: value }));

        if (name === 'transaction_category') {
            setTransferDetails(prev => ({...prev, transaction_subtype: ''}));
        }
    };

    const handleTransferSubmit = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!personnel || !personnel.id) {
            setError("İşlemi yapan personel bilgisi bulunamadı. Lütfen yeniden giriş yapın.");
            setIsLoading(false);
            return;
        }

        const payload = {
            destination_account_iban: selectedAccount.iban,
            amount: parseFloat(transferDetails.amount),
            currency_code: transferDetails.currency_code,
            transaction_category: transferDetails.transaction_category,
            transaction_subtype: transferDetails.transaction_subtype,
            description: transferDetails.description,
            created_by_personnel_id: personnel.id,
        };

        try {
            const data = await transactionService.createPersonnelTransfer(payload);
            if (!data.success) throw new Error(data.message || 'Transfer işlemi başarısız.');

            setSuccess(`Transfer başarıyla gerçekleştirildi. İşlem ID: ${data.transactionId}`);
            resetSearchState();
            setSearchQuery('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        searchQuery,
        setSearchQuery,
        customer,
        accounts,
        selectedAccount,
        transferDetails,
        isLoading,
        error,
        success,
        handleSearch,
        handleAccountSelect,
        handleFormChange,
        handleTransferSubmit,
    };
};