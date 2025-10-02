// resources/js/Pages/Student_Dashboard/ResidenceManagement.jsx
import { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function ResidenceManagement({ residence, users, accessList, roles }) {
    const [showAddAccessForm, setShowAddAccessForm] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [showChoiceDialog, setShowChoiceDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showResultsDialog, setShowResultsDialog] = useState(false);
    const [importResults, setImportResults] = useState(null);

    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        student_number: '',
        role: '',
    });

    const importForm = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('residence-management.access.add'), {
            onSuccess: () => {
                reset();
                setShowAddAccessForm(false);
            },
        });
    };

    const handleDeleteAccess = (id) => {
        if (confirm('Are you sure you want to remove this access entry?')) {
            router.delete(route('residence-management.access.delete', id));
        }
    };

    const handleAddAccessClick = () => {
        setShowChoiceDialog(true);
    };

    const handleManualAddition = () => {
        setShowChoiceDialog(false);
        setShowAddAccessForm(true);
    };

    const handleExcelImport = () => {
        setShowChoiceDialog(false);
        setShowImportDialog(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            importForm.setData('file', file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
            importForm.setData('file', file);
        } else {
            alert('Please upload an Excel file (.xlsx or .xls)');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to import');
            return;
        }
        importForm.post(route('residence-management.access.import'), {
            onSuccess: () => {
                setSelectedFile(null);
                setShowImportDialog(false);
                importForm.reset();
            },
        });
    };

    const downloadTemplate = () => {
        window.location.href = '/assets/excel/bulk_import_template.xlsx';
    };

    useEffect(() => {
        if (flash?.importResults) {
            setImportResults(flash.importResults);
            setShowResultsDialog(true);
        }
    }, [flash?.importResults]);

    return (
        <StudentLayout>
            <Head title="Residence Management" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Residence Management</h1>
                        <p className="text-gray-600">Manage residence information and user access</p>
                    </div>
                </div>
            </div>

            {/* Residence Information */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Residence Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Residence Name</p>
                        <p className="text-lg font-medium text-gray-900">{residence.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Campus</p>
                        <p className="text-lg font-medium text-gray-900">{residence.campus?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-lg font-medium text-gray-900">{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Access Management Section */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Access Management</h2>
                    <button
                        onClick={handleAddAccessClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                    >
                        Add New Access
                    </button>
                </div>

                {/* Choice Dialog */}
                {showChoiceDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Import Method</h3>
                            <p className="text-sm text-gray-600 mb-6">Select how you would like to add access entries</p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleManualAddition}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    Manual Addition
                                </button>
                                <button
                                    onClick={handleExcelImport}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    Excel Import
                                </button>
                                <button
                                    onClick={() => setShowChoiceDialog(false)}
                                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Excel Import Dialog */}
                {showImportDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Import from Excel</h3>
                                <button
                                    onClick={() => {
                                        setShowImportDialog(false);
                                        setSelectedFile(null);
                                        importForm.reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                                <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Download the template file below</li>
                                    <li>Fill in student information starting from row 2</li>
                                    <li>Make sure all required fields are filled</li>
                                    <li>Save the file and upload it using the form below</li>
                                </ul>
                                <button
                                    onClick={downloadTemplate}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Template
                                </button>
                            </div>

                            <form onSubmit={handleImportSubmit}>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                                    }`}
                                >
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="mt-4">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                                                Click to select a file
                                            </span>
                                            <span className="text-gray-500"> or drag and drop</span>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept=".xlsx,.xls"
                                                onChange={handleFileSelect}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Excel files only (.xlsx, .xls)</p>
                                    </div>
                                    {selectedFile && (
                                        <div className="mt-4 text-sm text-gray-700">
                                            <p className="font-medium">Selected file:</p>
                                            <p>{selectedFile.name}</p>
                                        </div>
                                    )}
                                </div>
                                {importForm.errors.file && (
                                    <p className="text-red-600 text-sm mt-2">{importForm.errors.file}</p>
                                )}
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowImportDialog(false);
                                            setSelectedFile(null);
                                            importForm.reset();
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={importForm.processing || !selectedFile}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                                    >
                                        {importForm.processing ? 'Importing...' : 'Import'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Import Results Dialog */}
                {showResultsDialog && importResults && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Import Results</h3>
                                <button
                                    onClick={() => {
                                        setShowResultsDialog(false);
                                        setImportResults(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-green-50 border border-green-200 rounded p-4">
                                    <p className="text-green-800 font-medium">
                                        Successfully added {importResults.added} student{importResults.added !== 1 ? 's' : ''} to the access list
                                    </p>
                                </div>
                            </div>

                            {importResults.invalid && importResults.invalid.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Invalid Entries ({importResults.invalid.length})
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Row
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Student Number
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Errors
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {importResults.invalid.map((entry, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.row}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.student_number}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.role}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-red-600">
                                                            {entry.errors}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowResultsDialog(false);
                                        setImportResults(null);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Access Form */}
                {showAddAccessForm && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Manual Addition</h3>
                            <button
                                onClick={() => setShowAddAccessForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Student Number
                                </label>
                                <input
                                    type="text"
                                    value={data.student_number}
                                    onChange={(e) => setData('student_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter student number"
                                    required
                                />
                                {errors.student_number && (
                                    <p className="text-red-600 text-sm mt-1">{errors.student_number}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.description}>
                                            {role.description}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-red-600 text-sm mt-1">{errors.role}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Access'}
                            </button>
                        </div>
                    </form>
                    </div>
                )}

                {/* Access List Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Has Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Added Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {accessList.length > 0 ? (
                                accessList.map((access) => (
                                    <tr key={access.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {access.student_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {access.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {access.has_registered ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {access.created_at}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteAccess(access.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No access entries found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registered Users Table */}
            <div className="bg-white rounded shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.student_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.roles || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.created_at}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
