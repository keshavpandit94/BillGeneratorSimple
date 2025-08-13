import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import CustomerDatabase from '../components/CustomerDatabase';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerDatabasePage = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/invoices/get-data')
            .then((res) => {
                // console.log(res.data);

                setCustomers(res.data)
            })
            .catch((err) => console.error('Error fetching customers:', err));
    }, []);

    const handleDelete = (invoiceNumber) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
        if (!confirmDelete) return;

        axios.delete(`/api/invoices/delete/${invoiceNumber}`)
            .then(() => {
                setCustomers(prev => prev.filter(c => c.invoiceNumber !== invoiceNumber));
                alert("Deleted Successfully");
            })
            .catch(err => {
                console.error('Delete failed', err);
                alert("Delete Failed");
            });
    };
    const handleEdit = (invoiceNumber) => {
        navigate(`/edit/${invoiceNumber}`)
    };

    const handlePreview = (invoiceNumber) => {
        navigate(`/perview/${invoiceNumber}`)
    }

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobileNumber.includes(searchTerm)
    );

    const handleDownloadExcel = () => {
        axios
            .get('/api/invoices/download-excel', {
                responseType: 'blob',
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'invoices.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // cleanup
            })
            .catch((error) => {
                console.error('Download failed:', error);
                alert('Failed to download Excel file.');
            });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <NavigationTabs />
            <CustomerDatabase
                customers={filteredCustomers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onExcelDownload={handleDownloadExcel}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
};

export default CustomerDatabasePage;
