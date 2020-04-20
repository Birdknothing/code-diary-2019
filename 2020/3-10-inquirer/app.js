const inquirer = require("inquirer");
inquirer
  .prompt([
    {
      type: "list",
      message: "Select toppings",
      name: "project",
      choices: [
        // new inquirer.Separator(" = The Meats = "),
        // {
        //   name: "Pepperoni"
        // },
        // {
        //   name: "Ham"
        // },
        // {
        //   name: "Ground Meat"
        // },
        // {
        //   name: "Bacon"
        // },
        new inquirer.Separator(" = The Cheeses = "),
        // {
        //   name: "Mozzarella",
        //   checked: true
        // },
        {
          name: "Cheddar"
        },
        {
          name: "Parmesan"
        }
      ],
      validate(ans) {
        return true;
      }
    }
  ])
  .then(ans => {
    console.log(ans);
  })
  .catch(err => {
    console.log("error", err);
  });
