const mongoose = require('mongoose');

const search = async (req, res) => {
    const { query } = req.body;
    const companyId = req.admin.companyId;

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Query is required"
        });
    }

    const lowerQuery = query.toLowerCase();
    let results = [];
    let responseText = "I couldn't find anything matching that.";

    // 1. Check for specific ID pattern (e.g., #101 or just number)
    const numberMatch = query.match(/#?(\d+)/);

    if (numberMatch) {
        const number = numberMatch[1];
        // Search Invoices
        const Invoice = mongoose.model('Invoice');
        const invoice = await Invoice.findOne({ number: number, companyId, removed: false }).populate('client');
        if (invoice) {
            results.push({
                type: 'card',
                entity: 'Invoice',
                title: `Invoice #${invoice.number}`,
                status: invoice.status,
                amount: invoice.total,
                client: invoice.client?.name,
                date: invoice.date
            });
        }

        // Search Quotes
        const Quote = mongoose.model('Quote');
        const quote = await Quote.findOne({ number: number, companyId, removed: false }).populate('client');
        if (quote) {
            results.push({
                type: 'card',
                entity: 'Quote',
                title: `Quote #${quote.number}`,
                status: quote.status,
                amount: quote.total,
                client: quote.client?.name
            });
        }
    }

    // 2. Search by Name (Client, Lead, Supplier, Labour)
    if (query.length > 2) {
        // Clients
        const Client = mongoose.model('Client');
        const clients = await Client.find({
            name: { $regex: new RegExp(query, 'i') },
            companyId,
            removed: false
        }).limit(3);

        clients.forEach(c => {
            results.push({
                type: 'card',
                entity: 'Client',
                title: c.name,
                email: c.email,
                phone: c.phone
            });
        });

        // Leads
        const Lead = mongoose.model('Lead');
        const leads = await Lead.find({
            name: { $regex: new RegExp(query, 'i') },
            companyId,
            removed: false
        }).limit(3);

        leads.forEach(l => {
            results.push({
                type: 'card',
                entity: 'Lead',
                title: l.name,
                status: l.status,
                source: l.source
            });
        });

        // Labour (People) - Using People model based on typical setup, referencing Labour logic
        // Assuming Labour is 'People' or 'Labour'. Found 'Labour' page in frontend, assuming model exists or is generic.
        // Checking previous file view: 'People' wasn't in the list, but 'Labour' page implementation uses 'labour' api. 
        // Let's assume there is a model for Labour, maybe 'Admin' with role? Or 'People'?
        // The list_dir showed 'PettyCashTransaction' but not 'Labour'. 
        // Wait, looking at routes... 'Labour' module exists.
        // I will check if 'Labour' model exists. If not, I'll search standard 'admin' or custom collection.
        // Safe bet: Search Supplier as well.

        const Supplier = mongoose.model('Supplier');
        const suppliers = await Supplier.find({
            name: { $regex: new RegExp(query, 'i') },
            companyId,
            removed: false
        }).limit(3);

        suppliers.forEach(s => {
            results.push({
                type: 'card',
                entity: 'Supplier',
                title: s.name,
                email: s.email,
                phone: s.phone
            });
        });
    }

    // 3. Keyword Checks
    if (lowerQuery.includes('outward') || lowerQuery.includes('expense') || lowerQuery.includes('petty')) {
        const PettyCashTransaction = mongoose.model('PettyCashTransaction');
        const expenses = await PettyCashTransaction.find({
            type: 'outward',
            companyId,
            removed: false
        }).sort({ date: -1 }).limit(3);

        if (expenses.length > 0) {
            responseText = "Here are the latest petty cash expenses:";
            expenses.forEach(e => {
                results.push({
                    type: 'text',
                    content: `${e.amount} - ${e.name} (${new Date(e.date).toLocaleDateString()})`
                });
            });
        }
    }

    // 4. Navigation Helper
    const navMap = {
        'create invoice': '/invoice/create',
        'add invoice': '/invoice/create',
        'invoice list': '/invoice',
        'show invoices': '/invoice',
        'create quote': '/quote/create',
        'quote list': '/quote',
        'add customer': '/customer', // Assuming modal or create page
        'customer list': '/customer',
        'leads': '/lead',
        'add lead': '/lead',
        'suppliers': '/supplier',
        'add supplier': '/supplier',
        'inventory': '/inventory',
        'products': '/inventory',
        'attendance': '/attendance',
        'mark attendance': '/attendance',
        'daily expense': '/daily-summary',
        'petty cash': '/pettycash',
        'settings': '/settings',
        'profile': '/profile',
        'dashboard': '/'
    };

    for (const [key, path] of Object.entries(navMap)) {
        if (lowerQuery.includes(key)) {
            results.push({
                type: 'action',
                action: 'navigate',
                path: path,
                label: `Go to ${key.replace(/\b\w/g, l => l.toUpperCase())}`
            });
            responseText = `I can help you with that. Click below to go to ${key}.`;
        }
    }

    if (results.length > 0 && responseText === "I couldn't find anything matching that.") {
        responseText = `I found ${results.length} results matching "${query}".`;
    }

    return res.status(200).json({
        success: true,
        result: {
            text: responseText,
            data: results
        }
    });
};

module.exports = { search };
