drop database if exists mysmrtdb;

create database mysmrtdb;

use mysmrtdb;

create table users (
	id int auto_increment,
	username varchar(64) not null,
	password varchar(256) not null,

	primary key(id)
);

insert into users (username,password) values ('test', sha2('test',256));
insert into users (username,password) values ('admin', sha2('admin',256));
select * from users;
select id from users;

create table roles (
	id int auto_increment,
	username varchar(64) not null,
	role text not null,
    userid int not null,

	primary key(id),
    constraint fk_username_id_roles
		foreign key(userid)
		references users(id)
		on delete cascade
		on update restrict
);

insert into roles (username,role,userid) values (
'test', 
'{ role: "user", resource: "addValue", action: "read:own" }',
1);

insert into roles (username,role,userid) values (
'test', 
'{ role: "user", resource: "checkValue", action: "read:own" }',
1);

insert into roles (username,role,userid) values (
'admin', 
'{ role: "admin", resource: "addValue", action: "read:all" }',
2);

insert into roles (username,role,userid) values (
'admin', 
'{ role: "admin", resource: "checkValue", action: "read:all" }',
2);

select * from roles;

create table wallets (
	id int auto_increment,
	username varchar(64) not null,
	bankvalue float not null,
    walletvalue float default 0,
    userid int not null,

	primary key(id),
    constraint fk_username_id_wallets
		foreign key(userid)
		references users(id)
		on delete cascade
		on update restrict
);


insert into wallets (username,bankvalue,walletvalue,userid) values ('test',5000,0,1);

insert into wallets (username,bankvalue,walletvalue,userid) values ('admin',5000,0,2);

select * from wallets;

select u.username,r.role,w.walletvalue
from users as u
join roles as r
on u.id = r.userid
join wallets as w
on u.id= w.userid
where u.username = "test";

select u.username,w.walletvalue
from users as u
join wallets as w
on u.id= w.userid
where u.username = "test";

desc wallets;



