//FOOD CALCULATOR
/*a function which retrieves the food list from the json file
@return{string};
*/
function getVals(){
    var x = new XMLHttpRequest();
    x.open("GET","/calculator/fitness-diet-calculator/test.json", false);
    x.send();
    var data = JSON.parse(x.responseText,true);
    return JSON.stringify(data);
}
    

/*
This function calculates the average values for a week in the day table.
It is called in the save() function so it calculates the average with every new entry in the day table.
average
@param{}
@return{bool|int|strin}
*/
function average(){
        //array used throughout the entire program, used to get specific DOM element wich contains usefull values
    var fields = ["carb", "protein","fat","calories"];

    //variable which stores the "average" cells from the day table
    var avrg = document.querySelectorAll(".avg");
    
    /* first set all values to 0 so they don't store values from previous calculations*/
    for( i=0; i < avrg.length; i++ ){
        avrg[i].innerHTML = 0;
    }

    /* In this loop, using the fields array the average cells are calculated one by one a collumn at a time.
    the empties variable is used to count how many cells are empty, so the division at the end of the loop is accurate.
    */
    for( i=0; i<fields.length; i++ ){
        var empties = 0;
        var x = document.querySelectorAll("."+fields[i]+"-day.element");
        for( j=0; j < x.length-1; j++ ){
            if( x[j].innerHTML != "" ){
                avrg[i].innerHTML = parseInt(avrg[i].innerHTML) + parseInt(x[j].innerHTML);
            } else {
                    empties++;
            };
        }
        avrg[i].innerHTML = (parseInt(avrg[i].innerHTML)/parseInt(x.length-1-parseInt(empties))).toFixed(2); 
    } 
}

/* This function adds an event listener to the days selector.
It clears the calculator table when the day is changed using the clearFields() function.*/
function clearDays(){
    var x = document.querySelector("#days");
    x.addEventListener("change",function(){
        clearFields();
    })
}

/* This function adds an click event to the save button.
It takes the values from the total row and adds them to the current day in the day table.*/
function save(){
    var button = document.querySelector(".save");
    button.addEventListener("click", function(){
        var fields = ["carb", "protein","fat","calories"];
        
        // The x var stores the current value of the days selector.
        var x = document.querySelector("#days").value;

        //The totals array stores all the total fields calculated earlier.
        var totals = new Array;
        for( i=0; i < fields.length; i++ ){
            totals.push(document.querySelector(".total-"+fields[i]+".element"));
        }

        //The day_head array stores the days from 1 to 7 from the day table.
        var y = document.querySelectorAll(".day.element");
        day_head = Array.from(y);

        //The first loop checks if the day header from the day table is found in the days selector.
        //If found, the cells array stores day-element cells and asigns the total amount of the specific field calculated earlier.
        for( i=0; i < day_head.length; i++ ){
            if( day_head[i].innerHTML.indexOf(x) >= 0 ){
                var row = document.querySelectorAll(".tb-row")[i];
                var cells = new Array();
                for( j=0; j< fields.length; j++ ){
                    cells.push(row.querySelector("."+fields[j]+"-day.element"));
                    if( typeof totals[j] != "undefined" && totals[j].innerHTML != "" ){
                        cells[j].innerHTML = parseInt(totals[j].innerHTML);
                        
                    }
                }
            }
        }
        // Here the average() function is called in order to calculate the new average after the new table entry.
        average();
    })  
}

/*
This function is used to clear a specific row in the calculator table.
@Param{HTMLelement(table row)}
*/
function clearRow(par){
    var fields = ["food", "portions", "portion-size", "carb", "protein", "fat", "calories"];
    var x = new Array();
    
    for( i=0; i< fields.length; i++ ){
        var y = par.querySelectorAll("."+fields[i]+".element");
        x = Array.from(y);
        x.forEach(function(element,index){

            //This condition is needed for the meal selector, because it is a child of a child.
            if( element.tagName == "DIV" && element.children.length == 1 && element.children[0].tagName == "SELECT" ){
                element.children[0].options[0].selected = "selected";
            } else{
                if ( element.type == "text" ){
                    element.value = "";
                } else {
                    element.innerHTML = "";
                }
            }   
        })
    }
    
}

/*
This function is used to clear all the fields in the calculator table. It is called whenever the "clear fields"
button is clicked.
*/
function clearFields(){
    var fields = ["food", "portions", "portion-size", "carb", "protein", "fat", "calories","total-carb","total-protein", "total-fat","total-calories"];
    for(i=0; i< fields.length; i++){
        var x = new Array();

        //Get all the elements that can hold a value and make an array from them.
        var y = document.querySelectorAll("."+fields[i]+".element");
        x = Array.from(y);
        x.forEach(function(element,index){

            //This condition is needed for the meal selector, because it is a child of a child.
            if( element.tagName == "DIV" && element.children.length == 1 && element.children[0].tagName == "SELECT" ){
                element.children[0].options[0].selected = "selected";
            } else {
                console.log();
                if( element.type == "text" ){
                    element.value = "";
                } else {
                    element.innerHTML = "";
                }
            }   
        })
    }
}

//This function adds an event listener to the clear button. Here the clearFields() function is called.
function buttonClear(){
    x = document.querySelector(".clear-flds");
    x.addEventListener("click",function(){
        clearFields();
    })
}

/*
This function adds an event listener to the "calculate" button.
When called, all the values from the calculator are calculated with the formula and stores the values in the
total row. From the total row, the save() function takes those values and adds them to the day table.
*/
function calculate(){
    var button = document.querySelector(".calculate");
    button.addEventListener("click", function(){
        var x = parseInt(document.querySelectorAll(".selector").innerHTML);
        var fields = ["carb", "protein","fat","calories"];

        //This loop takes column by column and adds all the values of a specific food attribute
        // and adds them to the coresponding "total" cell.
        for( var i = 0; i < fields.length; i++ ){
            var result = 0;
            var cells = '.'+fields[i]+'.element';

            //This variable stores all the cells with useful values for calculations.
            nodes = document.querySelectorAll(cells);
            for( j=0; j < nodes.length; j++ ){
                if( nodes[j].innerHTML == "" ){
                } else {
                    var result = parseInt(result) + parseInt(nodes[j].innerHTML); 
                }
            }
            var total = document.querySelector(".total-"+fields[i]);
            total.innerHTML = parseInt(result);
        }
    })
}
    
/*
This fucntion adds a change event listener to the "portions input". Whenever a new value is inputted
the cells from the coresponding row are used to calculate the total attributes of the specific food.
*/
function changePortion(){
    var x = document.querySelectorAll(".portions");
    for( i=0; i<=x.length; i++ ){
        if( typeof x[i] != "undefined" ){
            x[i].addEventListener("change", function(){
                var nodes = new Array();
                var fields = ["portion-size","carb", "protein","fat","calories"];
                for( var i = 0; i< fields.length; i++ ){
                    nodes.push(this.parentNode.querySelector("."+fields[i]));
                }

                //The data variable stores all the data from the .json file parsed using the JSON.parse().
                var data = getVals();
                data = JSON.parse(data);

                food = this.parentNode.querySelector(".selector").value;

                //This statement verifies if the inputted value is a number. If it is not then an allert with the message will be displayed.
                if( isNaN(this.value) == false ){
                    if( typeof food != "undefined" ){
                        var attributes = Object.values(data[food]);  
                        for( var i = 0; i< nodes.length; i++ ) {
                            nodes[i].innerHTML = this.value*attributes[i];
                        }
                    } 
                } else {
                        alert("Input must be a number!");
                }

            })
        }         
    }
}

/*
This function returns all the HTML selector elements from the calculator table.
It is used in the changeValues() function 
@Return{List of HTML elements}.
*/
function getSelectors(){
    var fields = ["breakfast", "lunch", "dinner" ];
    var allSelects = new Array();
    for( i=0; i < fields.length; i++ ){
        allSelects.push(document.querySelectorAll("#"+fields[i]+"-select"));
    }
    return allSelects;
}

/*
This function adds a change event listener to the meal selector element. Whenever a new meal is selected, its specific attributes 
are inserted in the table.
*/
function changeValues(){

    //The first 3 arrays store the meal selector element specific for each kind of meal.
    var breakfast = new Array();
    var lunch = new Array();
    var dinner = new Array();

    var selects = getSelectors();
    var portions = document.querySelectorAll(".portions.element");
    for( i=0; i < selects.length; i++ ){
        if( i==0 ){
            breakfast = Array.from(selects[i]);
        }
        if( i==1 ){
            lunch = Array.from(selects[i]);
        }
        if( i==2 ){
            dinner = Array.from(selects[i]);
        }
    }
    var selects = breakfast.concat(lunch,dinner);

    //Add change event for every selector.
    for( var index = 0; index < selects.length; index++ ){
        selects[index].addEventListener("change", function(){
            //The nodes variable stores all the elements coresponding to the current meal.
            var nodes = new Array();
            var fields = ["portion-size","carb", "protein","fat","calories"];
            var parentOfParent = this.parentNode.parentNode;
            var portion = parentOfParent.querySelector(".portions").value;
            for( var i = 0; i< fields.length; i++ ){
                nodes.push(parentOfParent.querySelector("."+fields[i]));
            }
            //If the selected meal is "none" the fields will be empty.
            var selected = this.value;
            if( selected == "none" ){
                for( var i = 0; i< nodes.length; i++){
                    nodes[i].innerHTML = "";
                } 

                //If a meal is chosen, the data variable stores the .json file contents and 
                //the values are stored in the table cells. 
            } else {
                var data = getVals();
                data = JSON.parse(data);
                var attributes = Object.values(data[selected]);
                for( var i = 0; i< nodes.length; i++ ){
                    nodes[i].innerHTML = attributes[i]*portion;
                }    
            }
        })
    }
}


/*
This function is used to add another meal row to the table. Adds a click event listener to 
the "+" element. Whenever clicked, a new row is inserted.
*/
function moreFoods(){
    var a = document.querySelectorAll(".add-new-row");

    //Add event listener for all 3 plus elements.
    for( var i = 0; i< a.length; i++ ){
        a[i].addEventListener("click",function(){

            //This var stores the rows limit to be inserted in the table.
            var limits = {"breakfast":5, "lunch":5, "dinner":4};

            //Take the row coresponding to the "+" element and clone it
            var c = this.parentNode;
            var b = c.cloneNode(true);

            //Format the new inserted.
            b.querySelector(".meal.element").style="border:none;";
            b.querySelector(".meal.element").innerHTML="";
            b.querySelector(".add-new-row").innerHTML = "";

            //Stores the curent value of the meal-type element.
            var current = this.parentNode.querySelector(".meal.element").innerHTML;


            var x = document.querySelectorAll(".meal-" + this.id);

            //This statement verifies if the meal-type value of the current row is Breakfast and if the rows limit is reached.
            if( current=="Breakfast" && x.length<limits["breakfast"] ){
                //Row insertion
                var z = this.parentNode.insertAdjacentElement("afterend",b);

                //Row must be cleared after insertions.
                clearRow(z);
                
                //Recal the function to add the event listener.
                changeValues();

                //Recal the function to add the event listener.
                changePortion();
            }

            if( current=="Lunch" && x.length<limits["lunch"] ){
                var z = this.parentNode.insertAdjacentElement("afterend",b);
                var x = this.parentNode.querySelectorAll(".element");
                y = Array.prototype.slice.call(x);
                clearRow(z);
                changeValues();
                changePortion();
            }

            if( current=="Dinner" && x.length<limits["dinner"] ){
                var z = this.parentNode.insertAdjacentElement("afterend",b);
                var x = this.parentNode.querySelectorAll(".element");
                clearRow(z);
                changeValues();
                changePortion();
            }
        })
    }
}

/*
This fucntion populates the meal selector elements with the list of foods taken from the .json file
*/
function populateSelect(){
    var selectors = new Array("breakfast","lunch","dinner");

    //The data from the .json file.
    var data = getVals();
    data = JSON.parse(data);

    //Populate every selector in the field.
    selectors.forEach(function(element,index){
        select = document.querySelector("#"+element+"-select");
        for( const [key, value] of Object.entries(data) ){

            //Create the "option" element.
            var opt = document.createElement("option");

            //Assignt the specific food.
            opt.value = key;
            opt.innerHTML = key;

            //Insert the element.
            select.appendChild(opt);
        }
    })
}
