Process to run the application

1) git clone
2) run npm i
3) set user, password, db, host, port in db.js file
4) run commands in database.sql to create tables
5) run node index.js


-----------------------------------------

APIs

To add a new user into the personal_wallet table.


Method: POST

/user

body-----> user_id, username, phone, balance


---------------------------------------------


To fetch the balance of a user from personal_wallet table

Method: GET

/balance?user_id=Usr1

params------> user_id


------------------------------------------------


To list all transactions of a user

Method: GET

/transactions?user_id=Usr1


params------> user_id



---------------------------------------------------


API to add funds


Method: PUT

/addFunds

body---------> user_id,amount


-------------------------------------------------------


API for spend funds

Method: PUT

/spendFunds


body---------> user_id,amount


---------------------------------------------------------

