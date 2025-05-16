# Buy Sell@ IIIT-H

### There are 10 pages in total. Front page, Login page, Signup page, Home page, Cart page, Orders page, Deliver items page, profile.

### Front page `/` is the entry point to the website where user will be prompted to login/signup. After successful login/signup user will be redirected to `/profile`

### In profile page user details are displayed and an option to edit is given. I havent implemented change/forgot password as it isn't that safe to do so. Since emails should be unique, I haven't given an option to change email as well.

### Home page `/search` displays all the items that iiit students are selling. Each item has an option to view. Also it has search functionality and filtering items based on category. I have assumed that inputs of search bar wont be space character

### On clicking on a specific item, it will redirected to a an items page, where details of that item will be displayed. It also has an option to add that item to cart

### If the user wants to sell an item, then he can add item through the option `add Item`, where details of items will be asked. I have assumed that images for items are not necessary.

### Clicking on Myorders will redirect to `/orders` which contains the details of the orders placed, sold by me and the pending orders. For pending orders, otp will not remain till the seller closes the transaction

### On clicking on MyCart it will redirect to `/mycart`, which displays the items present in my cart, along with total price of products present in the cart, along with an option to order. On ordering, random otps will be generated ``per item``

### Deliver Items redirects to `/deliver` which shows the orders received as seller. It displays the details of all the items that are being bought along with buyer name. Seller needs to enter an otp for every item/request to close the transaction. 


## BONUS:
### I have implemented chatbot using OpenAI api keys. It gives the response to users message based on context of present session. Although a session is not persistent when page is reloaded

### I have implemented Google Recaptcha using google's api keys. A user will be prompted to solve the captcha to ensure that he isnt a robot.

##

### To start the webpage, for front end command is `npm start`, for backend it is `npm run dev`
