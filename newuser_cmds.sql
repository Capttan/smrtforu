use mysmrtdb;

show tables;

desc roles;

use day31db;

desc users;

insert into users (username,password,email,department) values ('fred', sha2('fred',256), 'fred@gmail.com', 'IT');

select * from users;

select * from wallets;

desc wallets;

update wallets set bankvalue = 4980, walletvalue = 20 where userid='1';