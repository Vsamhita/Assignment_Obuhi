const express = require('express');
const app = express();
const pool = require("./db.js");

app.use(express.json());

// Fetches the balance of a user from personal_wallet table
app.get('/balance',async(req,res)=>{
    const user_id = req.query.user_id;
    try {
        const user = await pool.query("SELECT balance FROM personal_wallet where user_id = $1;", 
        [user_id]);
        
        if(user.rowCount == 0)
        {
            throw(new Error("User not found for the given id"));
        }else{
            const balance = user.rows[0].balance / 100;
            console.log(user.rows[0]);
            res.status(200).json({balance});
        }
     } catch (error) {
        res.status(400).json({"error": error.message});
    }
})

//List all transactions of a user
app.get('/transactions',async(req,res)=>{
    const user_id = req.query.user_id;
    try {
        const data = await pool.query("SELECT * FROM transactions where user_id = $1;", [user_id]);

        if(data.rowCount == 0) {
            throw(new Error("No transactions"));
        }else{
            console.log(data.rows[0]);
            res.status(200).json({"count": data.rowCount, "data": data.rows});

        }
       
     } catch (error) {
        res.status(400).json({"error": error.message});
    }
})


//Adds a new user to the personal_wallet table.
app.post('/user',async(req,res)=>{
    try {
        const {username,phone,balance} = req.body;
        const newUser = await pool.query("INSERT INTO personal_wallet (username, phone, balance) VALUES ($1, $2, $3) RETURNING *;",
            [username,phone,balance]
        )
        console.log(newUser.rows[0]);
        res.json(newUser.rows[0]);
    
    } catch (error) {
        res.status(400).json({"error": error.message});
    }
})

// Add funds to the account
app.put('/addFunds',async(req,res)=>{
    try {
        console.log(req.body);
        let { user_id, amount} = req.body;
        amount = amount*100;

        // get balance
        const balanceData = await pool.query("SELECT balance FROM personal_wallet where user_id = $1;",[user_id]);
        if(balanceData.rowCount == 0) {
            throw(new Error("User id not found"));
        }
        let balance = balanceData.rows[0].balance;
        const updated_balance = balance + amount;
        
        // update balance in personal_wallet table
        await pool.query("UPDATE personal_wallet SET balance = $1 WHERE user_id = $2;",
            [updated_balance,user_id]
        );
        
        // insert the transaction
        const data = await pool.query("INSERT INTO transactions (user_id, transaction_type, trans_date, initial_balance, amount, final_balance, remarks) VALUES ($1, $2, NOW(), $3, $4, $5, $6) RETURNING *;",
            [user_id,"add_funds", balance, amount, updated_balance, "Funds added"]
        );
        console.log(data.rows[0]);
        res.json(data.rows[0]);
    
    } catch (error) {
        console.log(error);
        res.status(400).json({"error": error.message});
    }
})

app.put('/spendFunds',async(req,res)=>{
    try {
        console.log(req.body);
        let { user_id, amount} = req.body;
        amount = amount*100;

        // get balance
        const balanceData = await pool.query("SELECT balance FROM personal_wallet where user_id = $1;",[user_id]);
        if(balanceData.rowCount == 0) {
            throw(new Error("User id not found"));
        }

        let balance = balanceData.rows[0].balance;
        const updated_balance = balance - amount;

        // error on balance less than zero
        if(updated_balance<0){
            throw(new Error("Insufficient funds"));
        }
        
        await pool.query("UPDATE personal_wallet SET balance = $1 WHERE user_id = $2;",
            [updated_balance,user_id]
        );
        
        // add transactions
        const data = await pool.query("INSERT INTO transactions (user_id, transaction_type, trans_date, initial_balance, amount, final_balance, remarks) VALUES ($1, $2, NOW(), $3, $4, $5, $6) RETURNING *;",
            [user_id,"spend_funds", balance, amount, updated_balance, "Funds removed"]
        );
        console.log(data.rows[0]);
        res.json(data.rows[0]);
    
    } catch (error) {
        console.log(error);
        res.status(400).json({"error": error.message});
    }
})



app.listen(3000,()=> {
    console.log("server is listening on port 3000");
});