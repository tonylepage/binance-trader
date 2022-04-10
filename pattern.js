
'use strict';

const jquery = require('jquery');
const ana01 = require('./models/ana01');


function displayTopAna01Patterns(){

    var allPatterns = null;
    
    ana01.getTopAna01Patterns((err, results)=>{
        if(err){
            console.log(err);
        }
        console.log('paterns=>', results);
        allPatterns = results;


        for ( var i = 0; i < allPatterns.length; i++ ){

            // Find a <table> element with id="patterns":
            var table = document.getElementById("patterns");

            // Create an empty <tr> element and add it to the 1st position of the table:
            var row = table.insertRow(i+1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            var cell9 = row.insertCell(8);
            var cell10 = row.insertCell(9);
            var cell11 = row.insertCell(10);
            var cell12 = row.insertCell(11);
            var cell13 = row.insertCell(12);
            var cell14 = row.insertCell(13);
            var cell15 = row.insertCell(14);
            var cell16 = row.insertCell(15);

        
            // Add some text to the new cells:
            cell1.innerHTML = `<font color='darkorange'>${results[i].occurance}</font>`;
            cell2.innerHTML = arrowPrinter(results[i].min_01_ind);
            cell3.innerHTML = arrowPrinter(results[i].min_02_ind);
            cell4.innerHTML = arrowPrinter(results[i].min_03_ind);
            cell5.innerHTML = arrowPrinter(results[i].min_04_ind);
            cell6.innerHTML = arrowPrinter(results[i].min_05_ind);
            cell7.innerHTML = arrowPrinter(results[i].min_06_ind);
            cell8.innerHTML = arrowPrinter(results[i].min_07_ind);
            cell9.innerHTML = arrowPrinter(results[i].min_08_ind);
            cell10.innerHTML = arrowPrinter(results[i].min_09_ind);
            cell11.innerHTML = arrowPrinter(results[i].min_10_ind);
            cell12.innerHTML = arrowPrinter(results[i].min_11_ind);
            cell13.innerHTML = arrowPrinter(results[i].min_12_ind);
            cell14.innerHTML = arrowPrinter(results[i].min_13_ind);
            cell15.innerHTML = arrowPrinter(results[i].min_14_ind);
            cell16.innerHTML = arrowPrinter(results[i].min_15_ind);
        }
    });
};

function arrowPrinter(upOrDown){

    if(upOrDown == -1) {
        return '<font color=\'red\' >&searr;</font>';
    }
    if(upOrDown == 1) {
        return '<font color=\'green\'>&nearr;</font>';
    }
    if(upOrDown == 0 || upOrDown == null) {
        return '<font color=\'black\'>&rarr;</font>';
    }
};

jquery(document).ready(function() {

    setTimeout(function(){ 
        jquery('.change').each(function() {
    
            if(parseInt($(this).text()) < 0) { 
                $(this).css('color','#E60000'); }
            else if(parseInt($(this).text()) > 0) { 
                $(this).css('color','#32cd32'); 
            }
        });
    },2000);

    displayTopAna01Patterns();
});