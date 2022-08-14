//Cloud Functions
// If you have set a function in another cloud code file, called "test.js" (for example)
// you need to refer it in your main.js, as you can see below:

Parse.Cloud.define("getDrink", async (request) => {
    const drinkName = request.params.drinkName;
    
    //getDrink
    const drinkModel = Parse.Object.extend("Drinks");
    let query = new Parse.Query(drinkModel);
    query.equalTo("Name", drinkName);
    const drink = await query.first({ useMasterKey: true });
  
    let drinkJSON =
      `"Drink": {
          "Name": "${drink.get("Name")}",
          "Price": ${drink.get("Price")},
          "Description": "${drink.get("Description")}",
          "ImageURL": "${drink.get("Image")["_url"]}"`;
  
    //getDrinkIngredients
    var drinkIngredientModel = Parse.Object.extend("DrinkIngredient");
    query = new Parse.Query(drinkIngredientModel);
    query.equalTo("DrinkID", drink);
    query.include("IngredientID");
    const drinkIngredients = await query.find({ useMasterKey: true });
    
    let drinkIngredientsJSON = '"Ingredients":[';
    for(let i = 0; i < drinkIngredients.length;i++){
      if (i > 0){
        drinkIngredientsJSON +=','
      }
      drinkIngredientsJSON +=
      ` { 
          "Name": "${drinkIngredients[i].get("IngredientID").get("Name")}",
          "Quantity": ${drinkIngredients[i].get("Quantity")},
          "Optional": ${drinkIngredients[i].get("Optional")}
        }`;
    }
    drinkIngredientsJSON +=']';
    
    //getDrinkCategories
    var drinkCategoryModel = Parse.Object.extend("DrinkCategory");
    query = new Parse.Query(drinkCategoryModel);
    query.equalTo("DrinkID", drink);
    query.include("CategoryID");
    const drinkCategories = await query.find({ useMasterKey: true });
    
    let drinkCategoriesJSON = '"Categories":[';
    for(let i = 0; i < drinkCategories.length;i++){
      if (i > 0){
        drinkCategoriesJSON +=','
      }
      drinkCategoriesJSON +=
      `
        "${drinkCategories[i].get("CategoryID").get("Name")}"
      `;
    }
    drinkCategoriesJSON +=']';
    
    const result = 
      `{  ${drinkJSON},
          ${drinkIngredientsJSON},
          ${drinkCategoriesJSON}
        }}`;
        
    return JSON.parse(result);
  });
  
  Parse.Cloud.define("getAllDrinks", async (request) => {
    let result = ''
    
    //getDrinks
    const drinkModel = Parse.Object.extend("Drinks");
    let query = new Parse.Query(drinkModel);
    query.ascending("Name");
    const drinks = await query.find({ useMasterKey: true });
    
    for(let d = 0; d < drinks.length;d++){
      if (d > 0){
        result +=','
      }
      let drinkJSON =
        `"Drink": {
            "Name": "${drinks[d].get("Name")}",
            "Price": ${drinks[d].get("Price")},
            "Description": "${drinks[d].get("Description")}",
            "ImageURL": "${drinks[d].get("Image")["_url"]}"`;
    
      //getDrinkIngredients
      var drinkIngredientModel = Parse.Object.extend("DrinkIngredient");
      query = new Parse.Query(drinkIngredientModel);
      query.equalTo("DrinkID", drinks[d]);
      query.include("IngredientID");
      query.ascending("IngredientID.Name");
      const drinkIngredients = await query.find({ useMasterKey: true });
      
      let drinkIngredientsJSON = '"Ingredients":[';
      for(let i = 0; i < drinkIngredients.length;i++){
        if (i > 0){
          drinkIngredientsJSON +=','
        }
        drinkIngredientsJSON +=
        ` { 
            "Name": "${drinkIngredients[i].get("IngredientID").get("Name")}",
            "Quantity": ${drinkIngredients[i].get("Quantity")},
            "Optional": ${drinkIngredients[i].get("Optional")}
          }`;
      }
      drinkIngredientsJSON +=']';
      
      //getDrinkCategories
      var drinkCategoryModel = Parse.Object.extend("DrinkCategory");
      query = new Parse.Query(drinkCategoryModel);
      query.equalTo("DrinkID", drinks[d]);
      query.include("CategoryID");
      query.ascending("CategoryID.Name");
      const drinkCategories = await query.find({ useMasterKey: true });
      
      let drinkCategoriesJSON = '"Categories":[';
      for(let i = 0; i < drinkCategories.length;i++){
        if (i > 0){
          drinkCategoriesJSON +=','
        }
        drinkCategoriesJSON +=
        `
          "${drinkCategories[i].get("CategoryID").get("Name")}"
        `;
      }
      drinkCategoriesJSON +=']';
      
      result += 
        `{  ${drinkJSON},
            ${drinkIngredientsJSON},
            ${drinkCategoriesJSON}
          }}`;
    }
    
    result = `[ ${result} ]`
    return JSON.parse(result);
  });
  