import { useState } from 'react';
import customerService from '../../../api/customerService';

export const useCustomerSearchPage = () => {
  const [tckn, setTckn] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAlert, setUpdateAlert] = useState(null);

  const [editingAccountId, setEditingAccountId] = useState(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);


  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setIsEditing(false);
    setUpdateAlert(null);
    setEditingAccountId(null);

    try {
      const data = await customerService.getCustomerByTckn(tckn);
      if (data.success) {
        setSearchResult(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateAlert(null);
    if (!isEditing && searchResult?.customer) {
      setEditableCustomer({ ...searchResult.customer });
    } else {
      setEditableCustomer(null);
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditableCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editableCustomer) return;

    setIsUpdating(true);
    setUpdateAlert(null);
    try {
      const response = await customerService.updateCustomer(editableCustomer.tckn, editableCustomer);

      if (response.success) {
        setSearchResult((prev) => ({
          ...prev,
          customer: response.customer,
        }));
        setIsEditing(false);
        setUpdateAlert({ type: 'success', message: response.message });
      } else {
        setUpdateAlert({ type: 'error', message: response.message });
      }
    } catch (err) {
      setUpdateAlert({ type: 'error', message: err.message || 'Güncelleme sırasında bir hata oluştu.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAccount = async (accountId, newBalance) => {
    setIsUpdatingAccount(true);
    setUpdateAlert(null);
    try {
      const response = await customerService.updateAccount(accountId, { balance: newBalance });
      if (response.success) {
        setSearchResult((prev) => ({
          ...prev,
          accounts: prev.accounts.map((acc) =>
            acc.account_id === accountId ? { ...acc, balance: newBalance } : acc
          ),
        }));
        setEditingAccountId(null);
        setUpdateAlert({ type: 'success', message: 'Hesap bakiyesi başarıyla güncellendi.' });
      } else {
        setUpdateAlert({ type: 'error', message: response.message });
      }
    } catch (err) {
      setUpdateAlert({ type: 'error', message: err.message || 'Hesap güncellenirken bir hata oluştu.' });
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleToggleStatusClick = async () => {
    if (!searchResult?.customer?.tckn) return;
    
    setIsTogglingStatus(true);
    setUpdateAlert(null);
    try {
      const response = await customerService.requestToggleStatusOTP(searchResult.customer.tckn);
      if (response.success) {
        setUpdateAlert({ type: 'info', message: 'Onay kodu konsola gönderildi. (Simülasyon)' });
        setOtpModalOpen(true);
      } else {
        setUpdateAlert({ type: 'error', message: response.message });
      }
    } catch (err) {
      setUpdateAlert({ type: 'error', message: err.message || 'OTP istenirken bir hata oluştu.' });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!searchResult?.customer?.tckn || !otp) return;

    setIsTogglingStatus(true);
    setUpdateAlert(null);
    try {
      const response = await customerService.confirmToggleStatus(searchResult.customer.tckn, otp);
      if (response.success) {
        setSearchResult(prev => ({
          ...prev,
          customer: {
            ...prev.customer,
            is_active: response.data.is_active
          }
        }));
        setUpdateAlert({ type: 'success', message: response.message });
        setOtpModalOpen(false);
        setOtp('');
      } else {
        setUpdateAlert({ type: 'error', message: response.message });
      }
    } catch (err) {
      setUpdateAlert({ type: 'error', message: err.message || 'Durum değiştirilirken bir hata oluştu.' });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const disableActions = isEditing || editingAccountId !== null;

  return {
    tckn, setTckn,
    searchResult,
    isLoading,
    error, setError,
    isEditing,
    editableCustomer,
    isUpdating,
    updateAlert, setUpdateAlert,
    editingAccountId, setEditingAccountId,
    isUpdatingAccount,
    disableActions,
    isOtpModalOpen, setOtpModalOpen,
    otp, setOtp,
    isTogglingStatus,
    handleSearch,
    handleEditToggle,
    handleFieldChange,
    handleUpdate,
    handleUpdateAccount,
    handleToggleStatusClick,
    handleConfirmToggleStatus,
  };
};