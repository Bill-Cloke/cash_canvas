import React, {useEffect, useState} from "react";


function BankAccounts() {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/bank/accounts", {credentials: "include"})
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setBankAccounts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
                

    
    }, []);
    return (
        <section className="space-y-2">
            {/* <h2 className="text-xl font-semibold">Linked Bank Accounts</h2> */}
                {loading ? (
                    <p>Loading accounts…</p>
                ) : bankAccounts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bankAccounts.map(acc => (
                    <div
                        key={acc.account_id}
                        className="bg-white p-4 rounded-lg shadow flex flex-col"
                    >
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-medium text-gray-800">{acc.name}</h3>
                            <span className="text-sm text-gray-500">••••{acc.mask}</span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">{acc.type}</p>
                        <p className="mt-2 text-lg font-semibold">
                            ${parseFloat(acc.balance).toFixed(2)}
                        </p>
                    </div>
                     ))}
                    </div>
                 ) : (
            <p className="text-gray-600">No bank accounts linked yet.</p>
          )}
        </section>
      );
}




export default BankAccounts;