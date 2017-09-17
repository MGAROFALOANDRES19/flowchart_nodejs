select * from flowcharts.users;
select * from flowcharts.flowcharts;

insert into flowcharts(title,users_username, model) values('ttteee', 'marco', '{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[],"linkDataArray":[]}');
insert into flowcharts.users(users.username, users.email, users.password) values('maria', 'xxx', '{xxxx}');

update flowcharts set model='{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[],"linkDataArray":[g]}' where title='tte' and users_username='marco';
update flowcharts.users set users.email = 'hola@gmail.com' where users.username = 'meche';

delete from flowcharts.users where users.username = 'x';
delete from flowcharts.flowcharts where flowcharts.title='x';