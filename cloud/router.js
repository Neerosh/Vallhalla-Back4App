
app.use(function(req, res, next) {
    res.locals.user = undefined;
    req.user = undefined;
    if (req.signedCookies["parse.user"] != undefined){
      req.user = JSON.parse(req.signedCookies["parse.user"]);
      res.locals.user = req.user;
    }
      next();
  });
  
  function handleParseError(err) {
    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        Parse.User.logOut();
        break;
    }
  }
  
  // GETS
  app.get('/', async(req, res) => {
      res.render('index', { message: '', RegisterMessage: '', typeStatus: ''});
  });
  
  app.get('/drinks', async(req, res) => {
      res.locals.drinkList =''
      
      try{
        var drinkList = await Parse.Cloud.run('getAllDrinks');
        res.locals.drinkList = JSON.stringify(drinkList);
        res.render('drinks', { message: "success get drinks", typeStatus: "success" });
      } catch (error){
        res.render('drinks', { message: error.message, typeStatus: "error" });
      }
  });
  
  app.get('/drinks/:drinkName', async(req, res) => {
    res.locals.drinkList = '';
    
    //console.log(req.params.drinkName);
    if(!req.params.drinkName){
      res.render('drinks', { message: "Param drinkName not found", typeStatus: "error" });
      return;
    }
    
    try{
      const drinkParam = {drinkName:`${req.params.drinkName}`}
      var drinkList = await Parse.Cloud.run('getDrink', drinkParam);
      res.locals.drinkList = JSON.stringify(drinkList);
      res.render('drinks', { message: "success get drink", typeStatus: "success" });
    } catch (error){
      res.render('drinks', { message: error.message, typeStatus: "error" });
    }
  });
  
  app.get('/users/create-account',async(req, res) => {
    if (req.user != undefined){
      res.send('Page Unavailable');
      return;
    }
     res.render('createAccount', {accountMessage: '', typeStatus: '', infoUser: ''});
  });
  
  app.get('/users/login', async(req, res) => {
    if (req.user != undefined){
      res.send('Page Unavailable');
      return;
    }
      res.render('login', {loginMessage: '', typeStatus: '', infoUser: ''});
  });
  
  app.get('/users/logout', async(req, res) => {
    if (req.user == undefined){
      res.send('Page Unavailable');
      return;
    }
    
    try{
      let user = await Parse.User.logOut();
      res.clearCookie('parse.user');
      res.locals.user = undefined;
      
      res.render('index', { message: "Logged Out", typeStatus: "success"});
    } catch (error){
      res.render('index', { message: error.message, typeStatus: "error"});
    }
  });
  
  // POSTS
  app.post('/users/login', async(req, res) => {
      let infoUser = req.body;
      
      try{
        let user = await Parse.User.logIn(infoUser.usernameLogin, infoUser.passwordLogin);
        var opts = {signed: true, path: '/'};
        // httpOnly: true
        val = JSON.stringify({user});
        res.cookie('parse.user', val, opts);
        res.locals.user = JSON.parse(val);
        res.render('index', { message: "Welcome back,"+res.locals.user.user.username+"!", typeStatus: "success"});
      } catch (error){
        handleParseError(error);
        res.clearCookie('parse.user');
        res.render('login', { loginMessage: error.message, RegisterMessage: '', typeStatus: "error", infoUser: infoUser});
      }
  });
  
  app.post('/users/create-account', async(req, res) => {
      let infoUser = req.body;
      
      try{
        
        let user = new Parse.User();
        // Set the input values to the new "User" object
        user.set("username", infoUser.userAccount);
        user.set("email", infoUser.emailAccount);
        user.set("password", infoUser.passwordAccount);
        user = await user.save();
        
        res.render('index', { message: "Account created, check your email!", typeStatus: "success"});
      } catch (error){
        handleParseError(error);
        res.clearCookie('parse.user');
        res.render('createAccount', { accountMessage: error.message, typeStatus: "error", infoUser: infoUser});
      }
  });