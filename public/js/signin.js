// Variables for submission
var nameToSubmit=""; 
var emailToSubmit=""; 
var asbNumberToSubmit=""; 
var clubToSubmit=""; 
var gradeToSubmit=""; 
var paragraphToSubmit="";
var booleanToSubmit=""; 
var timestampToSubmit="";
var previousHashToSubmit=""; 
var hashToSubmit=""; 

// On club selection from list
$('#entireClubSelection').on('click', '.clubLink', function(e)
{
    // Generate sign in fields from selected club
    clubToSubmit = $(e.target).attr('shorthand');
    for(let i=0; i<clubList.length; i++){
        if(clubList[i].shortHandName == clubToSubmit)
        {   
            // Get fields to show from the club selected
            var fieldsToShow = clubList[i].chosenFields; 
            var paragraphInstructions = (clubList[i].paragraphInstruction != undefined) ? clubList[i].paragraphInstruction : "Paragraph"; 
            var booleanInstructions = (clubList[i].booleanInstruction != undefined) ? clubList[i].booleanInstruction : "Boolean"; 
            for(let j = fieldsToShow.length - 1; j >=0; j--)
            {
                switch(fieldsToShow[j])
                {
                    case fields.NAME:
                    $("#signInForm").prepend('<div class="mb-3"><label for="name">Name</label><input type="text" class="form-control" id="name" placeholder="" required><div class="invalid-feedback">Please enter a valid name. </div></div>');
                    break; 

                    case fields.ASBNUMBER:
                    $("#signInForm").prepend('<div class="mb-3"><label for="name">ASB Number</label><input type="text" class="form-control" id="asbNumber" placeholder="" required><div class="invalid-feedback">Please enter a valid ASB number. </div></div>'); 
                    break; 

                    case fields.PARAGRAPH:
                    $("#signInForm").prepend('<div class="mb-3"><label for="paragraph">Paragraph Input</label><textarea type="text" class="form-control" id="paragraph" placeholder="'+paragraphInstructions+'"></textarea><div class="invalid-feedback">Please enter a valid paragraph.</div></div>'); 
                    break; 

                    case fields.EMAIL:
                    $("#signInForm").prepend('<div class="mb-3"><label for="email">Email</label><input type="text" class="form-control" id="email" placeholder="" required><div class="invalid-feedback">Please enter a valid email. </div></div>')
                    break; 

                    case fields.BOOLEAN: 
                    $("#signInForm").prepend('<div class="mb-3"><label for="sel1">'+booleanInstructions+'</label><select class="form-control" id="boolean"><option>False</option><option>True</option></select></div> ')
                    break; 

                    case fields.GRADE:
                    $("#signInForm").prepend('<div class="mb-3"><label for="grade">Grade</label><nav class="grade-buttons form-control" id="grade-buttons"><button class="btn btn-outline-primary disabled" id="g9" href="#">Grade 9</button><button class="btn btn-outline-primary disabled" id="g10" href="#">Grade 10</button><button class="btn btn-outline-primary disabled" id="g11" href="#">Grade 11</button><button class="btn btn-outline-primary disabled" id="g12" href="#">Grade 12</button></nav><div class="invalid-feedback">Please select your grade. </div></div>')
                    break; 
                }
            }
        }
    }

    $("#entireClubSelection").hide(250); 
    $(".entireSignInFields").show(250); 
});

// On Sign In
$("#signinbutton").click(function(e){
    updateBlockchain();
    var shouldSubmit = true; 

    // If an element with id "name" exists
    if($('#name').length)
    {
        nameToSubmit = $('#name').val(); 
        if(nameToSubmit.length < 4 || /\d/.test(nameToSubmit))
        {
            $("#name").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#name").addClass("is-valid");
        }
    }

    // If an element with id "email" exists
    if($('#email').length)
    {
        emailToSubmit = $('#email').val(); 
        if(emailToSubmit.length < 8 || !(emailToSubmit.includes("@")) || !(emailToSubmit.includes(".com")))
        {
            $("#email").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#email").addClass("is-valid");
        }
    }

    // If an element with id "asbNumber" exists
    if($('#asbNumber').length)
    {
        asbNumberToSubmit = $('#asbNumber').val(); 
        if(asbNumberToSubmit.length < 4 || !asbNumberToSubmit.match(/^[0-9]+$/))
        {
            $("#asbNumber").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#asbNumber").addClass("is-valid");
        }
    }

    // If an element with id "paragraph" exists
    if($('#paragraph').length)
    {
        paragraphToSubmit = $('#paragraph').val(); 
        if(paragraphToSubmit.length < 4)
        {
            $("#paragraph").addClass("is-invalid");
            shouldSubmit = false; 
        }
        else
        {
            $("#paragraph").addClass("is-valid");
        }
    }
    
    // If an element with id "grade-buttons" exists
    if($('#grade-buttons').length){
        if(gradeToSubmit == 9 || gradeToSubmit == 10 || gradeToSubmit == 11 || gradeToSubmit == 12)
        {
            $("#grade-buttons").addClass("is-valid");
        }
        else
        {
            $("#grade-buttons").addClass("is-invalid")
            shouldSubmit = false; 
        }
    }

    // If an element with id "boolean" exists
    if($('#boolean').length)
    {
        // Always has value as selection element
        $("#boolean").addClass("is-valid");
    }

    if(!shouldSubmit)
    {
        e.preventDefault(); 
        e.stopPropagation();
    }
    else // Should submit
    {
        timestampToSubmit = new Timestamp(); 
        timestampToSubmit.setCurrentTime(); 

        previousHashToSubmit = blockchainarray[blockchainarray.length - 1].hash; 

        var blockToSubmit = new Block(nameToSubmit,asbNumberToSubmit,clubToSubmit,gradeToSubmit,timestampToSubmit,previousHashToSubmit,hashToSubmit, paragraphToSubmit, booleanToSubmit, emailToSubmit); 
        blockToSubmit.hash = blockToSubmit.calculateHash(); 

        addBlockToDatabase(blockToSubmit);
        $("#signInForm")[0].reset(); 
    }

}); 


// Grade button click handling

    $("#g9").click(function(e) {
        e.preventDefault(); 

        if($("#g9").hasClass("disabled"))
        {
            $("#g9").removeClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").addClass("disabled"); 
            grade = 9; 
        } 
        else
        {
            $("#g9").addClass("disabled"); 
            grade = undefined; 
        }
    }); 

    $("#g10").click(function(e) {
        e.preventDefault(); 

        if($("#g10").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").removeClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").addClass("disabled"); 
            gradeToSubmit = 10; 
        } 
        else
        {
            $("#g10").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 

    $("#g11").click(function(e) {
        e.preventDefault(); 

        if($("#g11").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").removeClass("disabled"); 
            $("#g12").addClass("disabled"); 
            gradeToSubmit = 11; 
        } 
        else
        {
            $("#g11").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 

    $("#g12").click(function(e) {
        e.preventDefault(); 

        if($("#g12").hasClass("disabled"))
        {
            $("#g9").addClass("disabled"); 
            $("#g10").addClass("disabled"); 
            $("#g11").addClass("disabled"); 
            $("#g12").removeClass("disabled"); 
            gradeToSubmit = 12; 
        } 
        else
        {
            $("#g12").addClass("disabled"); 
            gradeToSubmit = undefined; 
        }
    }); 