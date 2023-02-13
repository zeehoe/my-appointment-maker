# my-appointment-maker
<img styles="height:200px" src="https://user-images.githubusercontent.com/108725098/218378364-80d26deb-64f8-4f34-ac41-2db88699c1b3.jpeg"/>
Hi! 

This is a basic appointment maker program, using react as frontend and node.js as backend.

2 directories are public (frontend react project) and sever (backend node js project)

For video demo, can please refer to here
https://youtu.be/FT-9KhEueBU

Server uses mongodb as database with database name appointment.
Please create a .env file under server folder, to include keys :
  - PORT
  - MONGO_URL
 
There are 2 helper files named error.js and joiValidations.
  - error.js > for creating error object that to be handled differently during catched
  - joiValidation > provide flexibility in validating params it received
  
Please also noticed that this backend also using cors mechanism.

There are total 4 api available 
  - BASE_URL/appointment/create
  - BASE_URL/appointment/cancel
  - BASE_URL/appointment/list/0123456789
  - BASE_URL/appointment/reschedule
  
Have a nice day :)
