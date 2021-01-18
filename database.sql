CREATE DATABASE wallet;


CREATE TABLE personal_wallet(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    phone VARCHAR(50) UNIQUE,
    balance INT 
);

CREATE TABLE transactions(
    user_id INT,
    transaction_type VARCHAR(50),
    trans_date DATE NOT NULL,
    initial_balance INT,
    amount INT,
    final_balance INT,
    remarks VARCHAR(50),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES personal_wallet(user_id)
);





